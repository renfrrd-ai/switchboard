-- Switchboard schema for a hosted Postgres with auth (written for Supabase).
-- Not wired up yet: the app currently saves to the browser. See README, "What's next".

create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  area          text not null check (area in ('school', 'products', 'builds', 'content', 'commitments', 'personal')),
  name          text not null default '',
  note          text not null default '',
  stage         text not null default 'Idea' check (stage in ('Idea', 'Planned', 'Building', 'MVP', 'Live', 'Ongoing')),
  last_touched  date not null default current_date,
  next_step     text not null default '',
  active        boolean not null default false,
  created_at    timestamptz not null default now()
);

create table public.deadlines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date        date not null,
  label       text not null,
  source      text not null default '',
  created_at  timestamptz not null default now()
);

create index projects_user_idx on public.projects (user_id);
create index deadlines_user_date_idx on public.deadlines (user_id, date);

-- Each person sees and changes only their own rows.
alter table public.projects enable row level security;
alter table public.deadlines enable row level security;

create policy "own projects" on public.projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own deadlines" on public.deadlines
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- The three-slot rule, enforced in the database so no client can break it.
-- School and Commitments are always on and never take a slot.
create function public.enforce_active_slots() returns trigger
language plpgsql as $$
declare
  taken integer;
begin
  if new.area in ('school', 'commitments') then
    new.active := false;
    return new;
  end if;

  if new.active then
    -- One person's slot changes run one at a time, so two devices can't both take the last slot.
    perform pg_advisory_xact_lock(hashtext(new.user_id::text));

    select count(*) into taken
    from public.projects
    where user_id = new.user_id
      and active
      and area not in ('school', 'commitments')
      and id <> new.id;

    if taken >= 3 then
      raise exception 'All three slots are in use. Park a project first.';
    end if;
  end if;

  return new;
end;
$$;

create trigger projects_active_slots
  before insert or update of active, area on public.projects
  for each row execute function public.enforce_active_slots();
