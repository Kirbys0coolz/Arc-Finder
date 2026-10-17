create table profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references auth.users(id) on delete cascade,
  name         text not null,
  bio          text not null default '',
  interests    text[] not null default '{}',
  skill        text not null default '',
  play_styles  text[] not null default '{}',
  availability text[] not null default '{}'
);

alter table profiles enable row level security;

create policy "anyone can read profiles"
  on profiles for select using (true);

create policy "users can create their own profile"
  on profiles for insert to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own profile"
  on profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;