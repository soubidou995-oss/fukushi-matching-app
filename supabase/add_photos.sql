-- 事業所・職員の写真アップロード機能のための追加設定
-- Supabase の SQL Editor で実行してください。

-- 1. counselor_profiles に写真用カラムを追加
alter table counselor_profiles
  add column avatar_url text,
  add column photo_urls text[] not null default '{}'::text[];

-- 2. 写真保存用のストレージバケットを作成（公開読み取り可、書き込みは本人のみ）
insert into storage.buckets (id, name, public)
values ('facility-photos', 'facility-photos', true)
on conflict (id) do nothing;

-- 3. ストレージのアクセスポリシー
-- 誰でも閲覧できる（ご家族側に写真を見せるため公開）
create policy "facility_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'facility-photos');

-- 本人（自分のユーザーIDフォルダ配下）のみアップロード・更新・削除できる
create policy "facility_photos_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'facility-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "facility_photos_update_own"
  on storage.objects for update
  using (
    bucket_id = 'facility-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "facility_photos_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'facility-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
