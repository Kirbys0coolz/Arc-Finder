create table profiles (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  bio          text not null default '',
  interests    text[] not null default '{}',  -- sports
  skill        text not null default '',      -- one of SKILL_LEVELS
  play_styles  text[] not null default '{}',
  availability text[] not null default '{}'
);

alter table profiles enable row level security;

create policy "anyone can read profiles"
  on profiles for select using (true);

create policy "anyone can create a profile"
  on profiles for insert with check (true);

grant select, insert on public.profiles to anon;