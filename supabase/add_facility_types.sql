-- 施設種別（生活相談員個人／特養／デイサービス等）対応のための追加カラム
-- Supabase の SQL Editor で実行してください（schema.sql, additional_policies.sql の後に実行）。

alter table counselor_profiles
  add column facility_type text not null default 'individual_counselor',
  add column extra_fields jsonb not null default '{}'::jsonb;
