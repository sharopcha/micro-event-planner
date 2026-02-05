-- Enable RLS on addons
alter table public.addons enable row level security;

-- Policy: Admins can do anything
create policy "Admins can insert addons"
on public.addons
for insert
with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

create policy "Admins can update addons"
on public.addons
for update
using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

create policy "Admins can delete addons"
on public.addons
for delete
using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- Policy: Admins can view all addons
create policy "Admins can view all addons"
on public.addons
for select
using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);
