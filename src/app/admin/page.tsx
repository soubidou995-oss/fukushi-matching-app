"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button, Chip, Input, Label } from "@/components/ui";
import type {
  CounselorProfile,
  FeeSettings,
  Match,
  Profile,
} from "@/lib/types";

type Nav = "approvals" | "fee" | "matches";

export default function AdminApp() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nav, setNav] = useState<Nav>("approvals");

  const [pendingCounselors, setPendingCounselors] = useState<
    (CounselorProfile & { profile?: Profile })[]
  >([]);
  const [fee, setFee] = useState<FeeSettings | null>(null);
  const [feeInput, setFeeInput] = useState("");
  const [approvedCount, setApprovedCount] = useState(0);
  const [matches, setMatches] = useState<
    (Match & { familyName?: string; counselorName?: string })[]
  >([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        loadProfile(data.session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
    if (data && (data as Profile).role === "admin") {
      loadApprovals();
      loadFee();
    }
    setLoading(false);
  }

  async function handleLogin() {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (data.user) loadProfile(data.user.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  async function loadApprovals() {
    const { data: cps } = await supabase
      .from("counselor_profiles")
      .select("*")
      .order("created_at", { ascending: false });
    const list = (cps as CounselorProfile[]) ?? [];
    const ids = list.map((c) => c.id);
    let profileMap: Record<string, Profile> = {};
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);
      (profs as Profile[] | null)?.forEach((p) => (profileMap[p.id] = p));
    }
    setPendingCounselors(list.map((c) => ({ ...c, profile: profileMap[c.id] })));
    setApprovedCount(list.filter((c) => c.status === "approved").length);
  }

  async function loadFee() {
    const { data } = await supabase
      .from("fee_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    setFee((data as FeeSettings) ?? null);
  }

  async function loadMatches() {
    const { data: ms } = await supabase
      .from("matches")
      .select("*")
      .order("matched_at", { ascending: false });
    const list = (ms as Match[]) ?? [];
    const ids = Array.from(
      new Set(list.flatMap((m) => [m.family_id, m.counselor_id]))
    );
    let nameMap: Record<string, string> = {};
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);
      (profs as Profile[] | null)?.forEach((p) => (nameMap[p.id] = p.name));
    }
    setMatches(
      list.map((m) => ({
        ...m,
        familyName: nameMap[m.family_id],
        counselorName: nameMap[m.counselor_id],
      }))
    );
  }

  async function approve(id: string) {
    await supabase
      .from("counselor_profiles")
      .update({ status: "approved" })
      .eq("id", id);
    loadApprovals();
  }

  async function reject(id: string) {
    await supabase
      .from("counselor_profiles")
      .update({ status: "rejected" })
      .eq("id", id);
    loadApprovals();
  }

  async function saveFee() {
    const value = Number(feeInput);
    if (!value) return;
    const { error } = await supabase.from("fee_settings").upsert({
      id: 1,
      monthly_fee: value,
      updated_by: profile?.id,
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      setFeeInput("");
      loadFee();
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray">読み込み中…</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center py-16 px-4">
        <Link href="/" className="text-main underline text-sm mb-6 self-start ml-[calc(50%-190px)]">
          ← アプリ選択
        </Link>
        <div className="w-full max-w-[380px] bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">運営管理画面ログイン</h2>
          <Label>メールアドレス</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Label>パスワード</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authError && <p className="text-danger text-xs mt-2">{authError}</p>}
          <Button onClick={handleLogin}>ログイン</Button>
        </div>
      </div>
    );
  }

  if (profile.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center py-16 px-4 text-sm">
        <Link href="/" className="text-main underline mb-6">
          ← アプリ選択
        </Link>
        <p>このアカウントには管理者権限がありません。</p>
        <p className="text-xs text-gray mt-2">
          Supabaseの Table Editor で profiles テーブルの role を &quot;admin&quot; に変更してください。
        </p>
        <button onClick={handleLogout} className="text-gray underline mt-4">
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[900px] mb-4 flex justify-between items-center text-sm">
        <Link href="/" className="text-main underline">
          ← アプリ選択
        </Link>
        <button onClick={handleLogout} className="text-gray underline">
          ログアウト
        </button>
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#1f3d33] text-white px-6 py-4 font-bold text-base">
          運営管理画面
        </div>
        <div className="flex min-h-[520px]">
          <div className="w-[180px] bg-[#f7f8f7] border-r border-neutral-200 py-3.5">
            {[
              { key: "approvals", label: "相談員審査" },
              { key: "fee", label: "月額料金設定" },
              { key: "matches", label: "マッチング状況" },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => {
                  setNav(item.key as Nav);
                  if (item.key === "matches") loadMatches();
                  if (item.key === "approvals") loadApprovals();
                }}
                className={`px-5 py-3 text-[13px] cursor-pointer ${
                  nav === item.key
                    ? "bg-white text-main font-bold border-l-[3px] border-main"
                    : "text-neutral-600"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex-1 p-5">
            {nav === "approvals" && (
              <div>
                <h3 className="font-bold text-base mb-3">生活相談員 登録審査</h3>
                <table className="w-full text-[12.5px] border-collapse">
                  <thead>
                    <tr>
                      {["氏名", "資格", "地域", "ステータス", "操作"].map((h) => (
                        <th
                          key={h}
                          className="text-left p-2 border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCounselors.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2 border-b border-neutral-100">
                          {c.profile?.name}
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          {c.qualifications}
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          {c.areas?.join("・")}
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          <Chip
                            tone={
                              c.status === "approved"
                                ? "matched"
                                : c.status === "rejected"
                                ? "rejected"
                                : "pending"
                            }
                          >
                            {c.status === "approved"
                              ? "承認済"
                              : c.status === "rejected"
                              ? "却下"
                              : "審査中"}
                          </Chip>
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          {c.status === "pending" ? (
                            <>
                              <button
                                onClick={() => approve(c.id)}
                                className="bg-[#e2f5e8] text-[#268a4e] rounded-md px-2.5 py-1 text-[11.5px] mr-1"
                              >
                                承認
                              </button>
                              <button
                                onClick={() => reject(c.id)}
                                className="bg-[#fde9e8] text-danger rounded-md px-2.5 py-1 text-[11.5px]"
                              >
                                却下
                              </button>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {nav === "fee" && (
              <div className="max-w-[360px]">
                <h3 className="font-bold text-base mb-3">
                  事業者向け月額料金の設定
                </h3>
                <p className="text-[11px] text-gray mb-2">
                  ご家族の利用は無料です。生活相談員・登録事業者に対してのみ、毎月定額の月額利用料金を課金します。
                </p>
                <div className="text-sm">現在の設定額（事業者1件あたり／月）</div>
                <div className="text-[28px] font-bold text-main my-2.5">
                  {fee ? `¥ ${fee.monthly_fee.toLocaleString()}` : "¥ ---"}
                </div>
                <Label>新しい金額（円／月）</Label>
                <Input
                  type="number"
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  placeholder="例：15000"
                />
                <div className="max-w-[200px]">
                  <Button onClick={saveFee}>この金額を保存する</Button>
                </div>
                <p className="text-[11px] text-gray mt-4">
                  承認済み事業者・相談員数：{approvedCount}件／月間見込み売上：
                  {fee
                    ? `¥ ${(fee.monthly_fee * approvedCount).toLocaleString()}`
                    : "未定"}
                </p>
              </div>
            )}

            {nav === "matches" && (
              <div>
                <h3 className="font-bold text-base mb-3">マッチング状況</h3>
                <p className="text-[11px] text-gray mb-2">
                  ご家族は無料のため、マッチングごとの料金・支払状況はありません。
                </p>
                <table className="w-full text-[12.5px] border-collapse">
                  <thead>
                    <tr>
                      {["ご家族", "相談員", "成立日", "ステータス"].map((h) => (
                        <th
                          key={h}
                          className="text-left p-2 border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m) => (
                      <tr key={m.id}>
                        <td className="p-2 border-b border-neutral-100">
                          {m.familyName}
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          {m.counselorName}
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          {new Date(m.matched_at).toLocaleDateString("ja-JP")}
                        </td>
                        <td className="p-2 border-b border-neutral-100">
                          <Chip tone="matched">成立済</Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
