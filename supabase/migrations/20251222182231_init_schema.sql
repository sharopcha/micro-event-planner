create type "public"."addon_category" as enum ('decor', 'food', 'drinks', 'activities', 'music', 'photography', 'extras', 'venue');

create type "public"."budget_tag" as enum ('cheap', 'standard', 'premium');

create type "public"."event_status" as enum ('draft', 'ready', 'paid');

create type "public"."event_type" as enum ('baby_shower', 'birthday_party', 'picnic', 'proposal');


  create table "public"."addons" (
    "id" uuid not null default gen_random_uuid(),
    "category" public.addon_category not null,
    "name" text not null,
    "description" text,
    "price" numeric(10,2) not null,
    "budget_tag" public.budget_tag not null,
    "compatible_event_types" public.event_type[] not null,
    "image_url" text,
    "active" boolean default true,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."addons" enable row level security;


  create table "public"."event_addons" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "addon_id" uuid not null,
    "quantity" integer default 1,
    "price_at_purchase" numeric(10,2) not null,
    "added_at" timestamp with time zone default now()
      );


alter table "public"."event_addons" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "event_type" public.event_type not null,
    "status" public.event_status default 'draft'::public.event_status,
    "name" text,
    "date" date,
    "time" time without time zone,
    "guest_count" integer,
    "budget" numeric(10,2),
    "city" text,
    "total_price" numeric(10,2) default 0,
    "stripe_payment_intent_id" text,
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."events" enable row level security;


  create table "public"."invitations" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "template_slug" text not null,
    "ai_generated_text" jsonb,
    "ai_config" jsonb,
    "custom_text" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."invitations" enable row level security;


  create table "public"."share_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "token" text not null,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone
      );


alter table "public"."share_tokens" enable row level security;

CREATE UNIQUE INDEX addons_pkey ON public.addons USING btree (id);

CREATE UNIQUE INDEX event_addons_event_id_addon_id_key ON public.event_addons USING btree (event_id, addon_id);

CREATE UNIQUE INDEX event_addons_pkey ON public.event_addons USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX invitations_event_id_key ON public.invitations USING btree (event_id);

CREATE UNIQUE INDEX invitations_pkey ON public.invitations USING btree (id);

CREATE UNIQUE INDEX share_tokens_event_id_key ON public.share_tokens USING btree (event_id);

CREATE UNIQUE INDEX share_tokens_pkey ON public.share_tokens USING btree (id);

CREATE UNIQUE INDEX addons_name_key ON public.addons USING btree (name);

CREATE UNIQUE INDEX share_tokens_token_key ON public.share_tokens USING btree (token);

alter table "public"."addons" add constraint "addons_pkey" PRIMARY KEY using index "addons_pkey";

alter table "public"."event_addons" add constraint "event_addons_pkey" PRIMARY KEY using index "event_addons_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."invitations" add constraint "invitations_pkey" PRIMARY KEY using index "invitations_pkey";

alter table "public"."share_tokens" add constraint "share_tokens_pkey" PRIMARY KEY using index "share_tokens_pkey";

alter table "public"."addons" add constraint "addons_name_key" UNIQUE using index "addons_name_key";

alter table "public"."addons" add constraint "check_price_positive" CHECK ((price > (0)::numeric)) not valid;

alter table "public"."addons" validate constraint "check_price_positive";

alter table "public"."event_addons" add constraint "check_quantity_positive" CHECK ((quantity > 0)) not valid;

alter table "public"."event_addons" validate constraint "check_quantity_positive";

alter table "public"."event_addons" add constraint "event_addons_addon_id_fkey" FOREIGN KEY (addon_id) REFERENCES public.addons(id) ON DELETE CASCADE not valid;

alter table "public"."event_addons" validate constraint "event_addons_addon_id_fkey";

alter table "public"."event_addons" add constraint "event_addons_event_id_addon_id_key" UNIQUE using index "event_addons_event_id_addon_id_key";

alter table "public"."event_addons" add constraint "event_addons_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_addons" validate constraint "event_addons_event_id_fkey";

alter table "public"."events" add constraint "check_budget_positive" CHECK ((budget > (0)::numeric)) not valid;

alter table "public"."events" validate constraint "check_budget_positive";

alter table "public"."events" add constraint "check_guest_count_positive" CHECK ((guest_count > 0)) not valid;

alter table "public"."events" validate constraint "check_guest_count_positive";

alter table "public"."events" add constraint "events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."events" validate constraint "events_user_id_fkey";

alter table "public"."invitations" add constraint "invitations_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."invitations" validate constraint "invitations_event_id_fkey";

alter table "public"."invitations" add constraint "invitations_event_id_key" UNIQUE using index "invitations_event_id_key";

alter table "public"."share_tokens" add constraint "share_tokens_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."share_tokens" validate constraint "share_tokens_event_id_fkey";

alter table "public"."share_tokens" add constraint "share_tokens_event_id_key" UNIQUE using index "share_tokens_event_id_key";

alter table "public"."share_tokens" add constraint "share_tokens_token_key" UNIQUE using index "share_tokens_token_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_event_total()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE events
  SET total_price = (
    SELECT COALESCE(SUM(price_at_purchase * quantity), 0)
    FROM event_addons
    WHERE event_id = NEW.event_id
  )
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_event_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.event_type IS NOT NULL 
     AND NEW.guest_count IS NOT NULL 
     AND NEW.budget IS NOT NULL 
     AND NEW.date IS NOT NULL 
     AND NEW.status = 'draft' THEN
    NEW.status = 'ready';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."addons" to "anon";

grant insert on table "public"."addons" to "anon";

grant references on table "public"."addons" to "anon";

grant select on table "public"."addons" to "anon";

grant trigger on table "public"."addons" to "anon";

grant truncate on table "public"."addons" to "anon";

grant update on table "public"."addons" to "anon";

grant delete on table "public"."addons" to "authenticated";

grant insert on table "public"."addons" to "authenticated";

grant references on table "public"."addons" to "authenticated";

grant select on table "public"."addons" to "authenticated";

grant trigger on table "public"."addons" to "authenticated";

grant truncate on table "public"."addons" to "authenticated";

grant update on table "public"."addons" to "authenticated";

grant delete on table "public"."addons" to "postgres";

grant insert on table "public"."addons" to "postgres";

grant references on table "public"."addons" to "postgres";

grant select on table "public"."addons" to "postgres";

grant trigger on table "public"."addons" to "postgres";

grant truncate on table "public"."addons" to "postgres";

grant update on table "public"."addons" to "postgres";

grant delete on table "public"."addons" to "service_role";

grant insert on table "public"."addons" to "service_role";

grant references on table "public"."addons" to "service_role";

grant select on table "public"."addons" to "service_role";

grant trigger on table "public"."addons" to "service_role";

grant truncate on table "public"."addons" to "service_role";

grant update on table "public"."addons" to "service_role";

grant delete on table "public"."event_addons" to "anon";

grant insert on table "public"."event_addons" to "anon";

grant references on table "public"."event_addons" to "anon";

grant select on table "public"."event_addons" to "anon";

grant trigger on table "public"."event_addons" to "anon";

grant truncate on table "public"."event_addons" to "anon";

grant update on table "public"."event_addons" to "anon";

grant delete on table "public"."event_addons" to "authenticated";

grant insert on table "public"."event_addons" to "authenticated";

grant references on table "public"."event_addons" to "authenticated";

grant select on table "public"."event_addons" to "authenticated";

grant trigger on table "public"."event_addons" to "authenticated";

grant truncate on table "public"."event_addons" to "authenticated";

grant update on table "public"."event_addons" to "authenticated";

grant delete on table "public"."event_addons" to "postgres";

grant insert on table "public"."event_addons" to "postgres";

grant references on table "public"."event_addons" to "postgres";

grant select on table "public"."event_addons" to "postgres";

grant trigger on table "public"."event_addons" to "postgres";

grant truncate on table "public"."event_addons" to "postgres";

grant update on table "public"."event_addons" to "postgres";

grant delete on table "public"."event_addons" to "service_role";

grant insert on table "public"."event_addons" to "service_role";

grant references on table "public"."event_addons" to "service_role";

grant select on table "public"."event_addons" to "service_role";

grant trigger on table "public"."event_addons" to "service_role";

grant truncate on table "public"."event_addons" to "service_role";

grant update on table "public"."event_addons" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "postgres";

grant insert on table "public"."events" to "postgres";

grant references on table "public"."events" to "postgres";

grant select on table "public"."events" to "postgres";

grant trigger on table "public"."events" to "postgres";

grant truncate on table "public"."events" to "postgres";

grant update on table "public"."events" to "postgres";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."invitations" to "anon";

grant insert on table "public"."invitations" to "anon";

grant references on table "public"."invitations" to "anon";

grant select on table "public"."invitations" to "anon";

grant trigger on table "public"."invitations" to "anon";

grant truncate on table "public"."invitations" to "anon";

grant update on table "public"."invitations" to "anon";

grant delete on table "public"."invitations" to "authenticated";

grant insert on table "public"."invitations" to "authenticated";

grant references on table "public"."invitations" to "authenticated";

grant select on table "public"."invitations" to "authenticated";

grant trigger on table "public"."invitations" to "authenticated";

grant truncate on table "public"."invitations" to "authenticated";

grant update on table "public"."invitations" to "authenticated";

grant delete on table "public"."invitations" to "postgres";

grant insert on table "public"."invitations" to "postgres";

grant references on table "public"."invitations" to "postgres";

grant select on table "public"."invitations" to "postgres";

grant trigger on table "public"."invitations" to "postgres";

grant truncate on table "public"."invitations" to "postgres";

grant update on table "public"."invitations" to "postgres";

grant delete on table "public"."invitations" to "service_role";

grant insert on table "public"."invitations" to "service_role";

grant references on table "public"."invitations" to "service_role";

grant select on table "public"."invitations" to "service_role";

grant trigger on table "public"."invitations" to "service_role";

grant truncate on table "public"."invitations" to "service_role";

grant update on table "public"."invitations" to "service_role";

grant delete on table "public"."share_tokens" to "anon";

grant insert on table "public"."share_tokens" to "anon";

grant references on table "public"."share_tokens" to "anon";

grant select on table "public"."share_tokens" to "anon";

grant trigger on table "public"."share_tokens" to "anon";

grant truncate on table "public"."share_tokens" to "anon";

grant update on table "public"."share_tokens" to "anon";

grant delete on table "public"."share_tokens" to "authenticated";

grant insert on table "public"."share_tokens" to "authenticated";

grant references on table "public"."share_tokens" to "authenticated";

grant select on table "public"."share_tokens" to "authenticated";

grant trigger on table "public"."share_tokens" to "authenticated";

grant truncate on table "public"."share_tokens" to "authenticated";

grant update on table "public"."share_tokens" to "authenticated";

grant delete on table "public"."share_tokens" to "postgres";

grant insert on table "public"."share_tokens" to "postgres";

grant references on table "public"."share_tokens" to "postgres";

grant select on table "public"."share_tokens" to "postgres";

grant trigger on table "public"."share_tokens" to "postgres";

grant truncate on table "public"."share_tokens" to "postgres";

grant update on table "public"."share_tokens" to "postgres";

grant delete on table "public"."share_tokens" to "service_role";

grant insert on table "public"."share_tokens" to "service_role";

grant references on table "public"."share_tokens" to "service_role";

grant select on table "public"."share_tokens" to "service_role";

grant trigger on table "public"."share_tokens" to "service_role";

grant truncate on table "public"."share_tokens" to "service_role";

grant update on table "public"."share_tokens" to "service_role";


  create policy "Anyone can view active addons"
  on "public"."addons"
  as permissive
  for select
  to public
using ((active = true));



  create policy "Users can manage addons for own events"
  on "public"."event_addons"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_addons.event_id) AND (events.user_id = auth.uid()) AND (events.status = ANY (ARRAY['draft'::public.event_status, 'ready'::public.event_status]))))));



  create policy "Users can create own events"
  on "public"."events"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete own draft events"
  on "public"."events"
  as permissive
  for delete
  to public
using (((auth.uid() = user_id) AND (status = 'draft'::public.event_status)));



  create policy "Users can update own events"
  on "public"."events"
  as permissive
  for update
  to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can view own events"
  on "public"."events"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can manage invitations for own events"
  on "public"."invitations"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = invitations.event_id) AND (events.user_id = auth.uid())))));



  create policy "Anyone can view share tokens"
  on "public"."share_tokens"
  as permissive
  for select
  to public
using (true);



  create policy "Users can create tokens for own events"
  on "public"."share_tokens"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = share_tokens.event_id) AND (events.user_id = auth.uid())))));


CREATE TRIGGER update_event_total_on_addon_change AFTER INSERT OR DELETE OR UPDATE ON public.event_addons FOR EACH ROW EXECUTE FUNCTION public.calculate_event_total();

CREATE TRIGGER check_event_ready_status BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_event_status();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


