-- Create Enum for User Roles
create type public.user_role as enum ('user', 'admin');

-- Create Profiles Table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  role public.user_role not null default 'user'::public.user_role,
  email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create Policy: Public Read (or limited to self/admin depending on needs, but public read is safe for minimal info like role if needed, currently let's restrict to self)
create policy "Users can view their own profile"
on public.profiles
for select
using ( auth.uid() = id );

create policy "Users can update their own profile"
on public.profiles
for update
using ( auth.uid() = id );

-- Create Function to Handle New User
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create Trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
