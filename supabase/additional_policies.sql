-- 最初のスキーマに不足していたポリシーを追加するパッチです。
-- Supabase の SQL Editor で実行してください（最初のスキーマ実行後に追加で実行）。

-- 新規登録時に自分のprofilesを作成できるようにする
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- ご家族が相談員を決定したときにmatchesを作成できるようにする
create policy "matches_insert_family" on matches
  for insert with check (family_id = auth.uid());

-- マッチング当事者がレビューを投稿できるようにする
create policy "reviews_insert_participants" on reviews
  for insert with check (
    exists (
      select 1 from matches m
      where m.id = match_id and (m.family_id = auth.uid() or m.counselor_id = auth.uid())
    )
  );

-- 管理者が月額料金の初回登録（行がまだ無い場合のinsert）をできるようにする
create policy "fee_settings_insert_admin" on fee_settings
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
