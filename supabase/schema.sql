-- 全国福祉マッチングアプリ Supabaseスキーマ（実行済みの記録用）
-- 本体は Supabase ダッシュボードの SQL Editor で実行済みです。
-- 追加の修正は additional_policies.sql を参照してください。

create type user_role as enum ('family', 'counselor', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create type counselor_status as enum ('pending', 'approved', 'rejected');

create table counselor_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  qualifications text,
  experience_years int,
  areas text[],
  bio text,
  certificate_url text,
  status counselor_status not null default 'pending',
  rating_avg numeric(2,1) default 0,
  rating_count int default 0,
  created_at timestamptz not null default now()
);

create type request_status as enum ('open', 'matched', 'closed');

create table requests (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  area text not null,
  support_type text not null,
  frequency text,
  budget text,
  memo text,
  status request_status not null default 'open',
  created_at timestamptz not null default now()
);

create type application_status as enum ('pending', 'matched', 'rejected');

create table applications (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  counselor_id uuid not null references profiles(id) on delete cascade,
  message text,
  status application_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (request_id, counselor_id)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  family_id uuid not null references profiles(id) on delete cascade,
  counselor_id uuid not null references profiles(id) on delete cascade,
  matched_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table fee_settings (
  id int primary key default 1,
  monthly_fee int not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

alter table profiles enable row level security;
alter table counselor_profiles enable row level security;
alter table requests enable row level security;
alter table applications enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table fee_settings enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

create policy "counselor_select_approved_or_own" on counselor_profiles
  for select using (status = 'approved' or auth.uid() = id);
create policy "counselor_update_own" on counselor_profiles
  for update using (auth.uid() = id);
create policy "counselor_insert_own" on counselor_profiles
  for insert with check (auth.uid() = id);

create policy "requests_select" on requests
  for select using (status = 'open' or family_id = auth.uid());
create policy "requests_insert_own" on requests
  for insert with check (family_id = auth.uid());
create policy "requests_update_own" on requests
  for update using (family_id = auth.uid());

create policy "applications_select" on applications
  for select using (
    counselor_id = auth.uid()
    or exists (select 1 from requests r where r.id = request_id and r.family_id = auth.uid())
  );
create policy "applications_insert_own" on applications
  for insert with check (counselor_id = auth.uid());
create policy "applications_update" on applications
  for update using (
    counselor_id = auth.uid()
    or exists (select 1 from requests r where r.id = request_id and r.family_id = auth.uid())
  );

create policy "matches_select_participants" on matches
  for select using (family_id = auth.uid() or counselor_id = auth.uid());

create policy "messages_select_participants" on messages
  for select using (
    exists (
      select 1 from matches m
      where m.id = match_id and (m.family_id = auth.uid() or m.counselor_id = auth.uid())
    )
  );
create policy "messages_insert_participants" on messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from matches m
      where m.id = match_id and (m.family_id = auth.uid() or m.counselor_id = auth.uid())
    )
  );

create policy "reviews_select_participants" on reviews
  for select using (
    exists (
      select 1 from matches m
      where m.id = match_id and (m.family_id = auth.uid() or m.counselor_id = auth.uid())
    )
  );

create policy "fee_settings_select_all" on fee_settings for select using (true);
create policy "fee_settings_update_admin" on fee_settings
  for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin_full_access_counselor" on counselor_profiles for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admin_full_access_requests" on requests for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admin_full_access_matches" on matches for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
