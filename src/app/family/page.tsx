"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  AppHeader,
  Button,
  Card,
  Chip,
  Input,
  Label,
  Select,
  TabBar,
  Textarea,
} from "@/components/ui";
import type {
  Application,
  CounselorProfile,
  FamilyRequest,
  Message,
  Profile,
} from "@/lib/types";

type Screen =
  | "login"
  | "home"
  | "new-request"
  | "request-detail"
  | "applicant-profile"
  | "match-confirm"
  | "message"
  | "mypage";

export default function FamilyApp() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [tab, setTab] = useState<"home" | "message" | "mypage">("home");

  // auth form
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // data
  const [requests, setRequests] = useState<FamilyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FamilyRequest | null>(
    null
  );
  const [applicants, setApplicants] = useState<
    (Application & { counselor?: CounselorProfile & { profile?: Profile } })[]
  >([]);
  const [selectedApplicant, setSelectedApplicant] = useState<
    (Application & { counselor?: CounselorProfile & { profile?: Profile } }) | null
  >(null);
  const [activeMatch, setActiveMatch] = useState<{
    id: string;
    counselorName: string;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  // new request form
  const [form, setForm] = useState({
    title: "",
    area: "東京都 世田谷区",
    support_type: "生活相談・見守り",
    frequency: "",
    budget: "",
    memo: "",
  });

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
    if (data) {
      setProfile(data as Profile);
      setScreen("home");
      loadRequests(userId);
    }
    setLoading(false);
  }

  async function loadRequests(familyId: string) {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .eq("family_id", familyId)
      .order("created_at", { ascending: false });
    setRequests((data as FamilyRequest[]) ?? []);
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

  async function handleSignup() {
    setAuthError(null);
    setAuthNotice(null);
    if (!name.trim()) {
      setAuthError("氏名を入力してください");
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (!data.session) {
      setAuthNotice(
        "確認メールを送信しました。メール内のリンクを確認してから、ログインしてください（Supabaseの設定でメール確認をオフにしている場合はそのままログインできます）。"
      );
      return;
    }
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user!.id,
      role: "family",
      name,
    });
    if (profileError) {
      setAuthError(profileError.message);
      return;
    }
    loadProfile(data.user!.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setScreen("login");
  }

  async function submitNewRequest() {
    if (!profile) return;
    if (!form.title.trim()) return;
    const { error } = await supabase.from("requests").insert({
      family_id: profile.id,
      title: form.title,
      area: form.area,
      support_type: form.support_type,
      frequency: form.frequency,
      budget: form.budget,
      memo: form.memo,
      status: "open",
    });
    if (!error) {
      setForm({
        title: "",
        area: "東京都 世田谷区",
        support_type: "生活相談・見守り",
        frequency: "",
        budget: "",
        memo: "",
      });
      loadRequests(profile.id);
      setScreen("home");
    }
  }

  async function openRequestDetail(req: FamilyRequest) {
    setSelectedRequest(req);
    const { data: apps } = await supabase
      .from("applications")
      .select("*")
      .eq("request_id", req.id);
    const list = (apps as Application[]) ?? [];
    const counselorIds = list.map((a) => a.counselor_id);
    let counselorMap: Record<string, CounselorProfile & { profile?: Profile }> = {};
    if (counselorIds.length > 0) {
      const { data: counselors } = await supabase
        .from("counselor_profiles")
        .select("*")
        .in("id", counselorIds);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", counselorIds);
      const profileMap: Record<string, Profile> = {};
      (profiles as Profile[] | null)?.forEach((p) => (profileMap[p.id] = p));
      (counselors as CounselorProfile[] | null)?.forEach((c) => {
        counselorMap[c.id] = { ...c, profile: profileMap[c.id] };
      });
    }
    setApplicants(
      list.map((a) => ({ ...a, counselor: counselorMap[a.counselor_id] }))
    );
    setScreen("request-detail");
  }

  function openApplicantProfile(
    app: Application & { counselor?: CounselorProfile & { profile?: Profile } }
  ) {
    setSelectedApplicant(app);
    setScreen("applicant-profile");
  }

  async function confirmMatch() {
    if (!profile || !selectedRequest || !selectedApplicant) return;
    const { data: match, error } = await supabase
      .from("matches")
      .insert({
        request_id: selectedRequest.id,
        family_id: profile.id,
        counselor_id: selectedApplicant.counselor_id,
      })
      .select()
      .single();
    if (error) return;
    await supabase
      .from("applications")
      .update({ status: "matched" })
      .eq("id", selectedApplicant.id);
    await supabase
      .from("applications")
      .update({ status: "rejected" })
      .eq("request_id", selectedRequest.id)
      .neq("id", selectedApplicant.id);
    await supabase
      .from("requests")
      .update({ status: "matched" })
      .eq("id", selectedRequest.id);
    setActiveMatch({
      id: match.id,
      counselorName: selectedApplicant.counselor?.profile?.name ?? "相談員",
    });
    loadRequests(profile.id);
    setScreen("match-confirm");
  }

  async function openMessages() {
    if (!activeMatch) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("match_id", activeMatch.id)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) ?? []);
    setTab("message");
    setScreen("message");
  }

  async function sendMessage() {
    if (!profile || !activeMatch || !messageText.trim()) return;
    const { error } = await supabase.from("messages").insert({
      match_id: activeMatch.id,
      sender_id: profile.id,
      body: messageText,
    });
    if (!error) {
      setMessageText("");
      openMessages();
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray">読み込み中…</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-[380px] mb-4 flex justify-between items-center text-sm">
        <Link href="/" className="text-main underline">
          ← アプリ選択
        </Link>
        {profile && (
          <button onClick={handleLogout} className="text-gray underline">
            ログアウト
          </button>
        )}
      </div>

      <div className="w-[340px] h-[680px] bg-black rounded-[36px] p-2.5 shadow-xl flex flex-col">
        <div className="h-[18px] flex items-center justify-center text-white text-[10px]">
          ご家族アプリ
        </div>
        <div className="flex-1 bg-white rounded-[26px] overflow-hidden flex flex-col relative">
          {screen === "login" && (
            <div className="flex-1 overflow-y-auto p-3.5">
              <AppHeader title="ログイン" />
              <div className="p-3.5 text-[13px]">
                <p className="text-center mt-6 text-xl">🏠🤝</p>
                <h3 className="text-center font-bold text-base mb-2">
                  全国福祉マッチング
                </h3>
                <Label>氏名（新規登録時のみ）</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="宮本 太郎"
                />
                <Label>メールアドレス</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Label>パスワード</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {authError && (
                  <p className="text-danger text-xs mt-2">{authError}</p>
                )}
                {authNotice && (
                  <p className="text-main text-xs mt-2">{authNotice}</p>
                )}
                <Button
                  onClick={() => {
                    setAuthMode("login");
                    handleLogin();
                  }}
                >
                  ログイン
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setAuthMode("signup");
                    handleSignup();
                  }}
                >
                  新規登録
                </Button>
              </div>
            </div>
          )}

          {screen === "home" && profile && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="マイリクエスト" />
              <div className="flex-1 overflow-y-auto p-3.5 relative">
                {requests.length === 0 && (
                  <p className="text-xs text-gray text-center mt-8">
                    まだリクエストがありません
                  </p>
                )}
                {requests.map((r) => (
                  <Card key={r.id} onClick={() => openRequestDetail(r)}>
                    <h4 className="text-[13.5px] font-bold mb-1">
                      {r.title}{" "}
                      <Chip
                        tone={
                          r.status === "open"
                            ? "open"
                            : r.status === "matched"
                            ? "matched"
                            : "closed"
                        }
                      >
                        {r.status === "open"
                          ? "募集中"
                          : r.status === "matched"
                          ? "マッチング済"
                          : "終了"}
                      </Chip>
                    </h4>
                    <p className="text-xs text-neutral-500">
                      地域：{r.area}／頻度：{r.frequency || "-"}
                    </p>
                  </Card>
                ))}
                <div
                  onClick={() => setScreen("new-request")}
                  className="absolute right-4 bottom-4 w-[46px] h-[46px] rounded-full bg-accent text-white text-2xl flex items-center justify-center shadow-lg cursor-pointer"
                >
                  ＋
                </div>
              </div>
              <TabBar
                tabs={[
                  { key: "home", label: "ホーム" },
                  { key: "message", label: "メッセージ" },
                  { key: "mypage", label: "マイページ" },
                ]}
                active={tab}
                onChange={(k) => {
                  setTab(k as typeof tab);
                  if (k === "message") openMessages();
                  else setScreen(k as Screen);
                }}
              />
            </div>
          )}

          {screen === "new-request" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="新規リクエスト作成" onBack={() => setScreen("home")} />
              <div className="flex-1 overflow-y-auto p-3.5">
                <Label>タイトル</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例：週2回の生活相談をお願いしたい"
                />
                <Label>地域</Label>
                <Select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                >
                  <option>東京都 世田谷区</option>
                  <option>大阪府 豊中市</option>
                  <option>福岡県 福岡市</option>
                </Select>
                <Label>支援内容</Label>
                <Select
                  value={form.support_type}
                  onChange={(e) =>
                    setForm({ ...form, support_type: e.target.value })
                  }
                >
                  <option>生活相談・見守り</option>
                  <option>通院・買い物同行</option>
                  <option>各種手続き支援</option>
                </Select>
                <Label>希望頻度・日時</Label>
                <Input
                  value={form.frequency}
                  onChange={(e) =>
                    setForm({ ...form, frequency: e.target.value })
                  }
                  placeholder="例：週2回、平日午前"
                />
                <Label>予算感（任意）</Label>
                <Input
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="例：月2万円程度"
                />
                <Label>詳細メモ</Label>
                <Textarea
                  value={form.memo}
                  onChange={(e) => setForm({ ...form, memo: e.target.value })}
                  placeholder="ご家族の状況、ご希望などをご記入ください"
                />
                <Button onClick={submitNewRequest}>投稿する</Button>
              </div>
            </div>
          )}

          {screen === "request-detail" && selectedRequest && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="応募者一覧" onBack={() => setScreen("home")} />
              <div className="flex-1 overflow-y-auto p-3.5">
                <p className="text-[11px] text-gray mb-2">
                  「{selectedRequest.title}」への応募
                </p>
                {applicants.length === 0 && (
                  <p className="text-xs text-gray text-center mt-8">
                    まだ応募がありません
                  </p>
                )}
                {applicants.map((a) => (
                  <Card key={a.id} onClick={() => openApplicantProfile(a)}>
                    <h4 className="text-[13.5px] font-bold mb-1">
                      {a.counselor?.profile?.name ?? "相談員"}{" "}
                      <span className="text-[13px] text-[#e0a72e]">
                        ★{a.counselor?.rating_avg ?? "-"}
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {a.counselor?.qualifications} ／ 経験
                      {a.counselor?.experience_years}年
                    </p>
                    <p className="text-xs text-neutral-500">「{a.message}」</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {screen === "applicant-profile" && selectedApplicant && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader
                title="相談員プロフィール"
                onBack={() => setScreen("request-detail")}
              />
              <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
                <h3 className="font-bold text-base mb-1">
                  {selectedApplicant.counselor?.profile?.name}{" "}
                  <span className="text-[#e0a72e] text-sm">
                    ★{selectedApplicant.counselor?.rating_avg ?? "-"}
                  </span>{" "}
                  （{selectedApplicant.counselor?.rating_count ?? 0}件）
                </h3>
                <p>資格：{selectedApplicant.counselor?.qualifications}</p>
                <p>
                  経験：{selectedApplicant.counselor?.experience_years}年／対応地域：
                  {selectedApplicant.counselor?.areas?.join("・")}
                </p>
                <p className="mt-2.5">
                  自己PR：{selectedApplicant.counselor?.bio}
                </p>
                <p className="mt-2.5">
                  応募メッセージ：「{selectedApplicant.message}」
                </p>
                <Button onClick={confirmMatch}>この相談員に決定する</Button>
              </div>
            </div>
          )}

          {screen === "match-confirm" && activeMatch && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="マッチング確定" onBack={() => setScreen("home")} />
              <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
                <p>
                  {activeMatch.counselorName}さんとのマッチングが成立しました。
                </p>
                <div className="bg-main-light rounded-xl p-4 text-center my-3.5">
                  <div className="font-bold">ご家族のご利用は無料です</div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    ご家族に費用が発生することはありません。
                  </div>
                </div>
                <Button variant="secondary" onClick={openMessages}>
                  相談員にメッセージを送る
                </Button>
              </div>
            </div>
          )}

          {screen === "message" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader
                title={activeMatch?.counselorName ?? "メッセージ"}
                onBack={() => setScreen("home")}
              />
              <div className="flex-1 overflow-y-auto p-3.5">
                {!activeMatch && (
                  <p className="text-xs text-gray text-center mt-8">
                    マッチングが成立するとメッセージができます
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] px-3 py-2 rounded-2xl mb-2 text-[12.5px] ${
                      m.sender_id === profile?.id
                        ? "bg-main text-white ml-auto rounded-br-sm"
                        : "bg-neutral-100 rounded-bl-sm"
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
                {activeMatch && (
                  <div className="flex gap-2 mt-2.5">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="メッセージを入力"
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-main text-white rounded-lg px-3 text-xs shrink-0"
                    >
                      送信
                    </button>
                  </div>
                )}
              </div>
              <TabBar
                tabs={[
                  { key: "home", label: "ホーム" },
                  { key: "message", label: "メッセージ" },
                  { key: "mypage", label: "マイページ" },
                ]}
                active={tab}
                onChange={(k) => {
                  setTab(k as typeof tab);
                  setScreen(k as Screen);
                }}
              />
            </div>
          )}

          {screen === "mypage" && profile && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="マイページ" />
              <div className="flex-1 overflow-y-auto p-3.5">
                <Card>氏名：{profile.name} 様</Card>
                <Card>ご利用は無料です</Card>
                <Card>評価・レビュー履歴</Card>
                <Card>お問い合わせ</Card>
              </div>
              <TabBar
                tabs={[
                  { key: "home", label: "ホーム" },
                  { key: "message", label: "メッセージ" },
                  { key: "mypage", label: "マイページ" },
                ]}
                active={tab}
                onChange={(k) => {
                  setTab(k as typeof tab);
                  if (k === "message") openMessages();
                  else setScreen(k as Screen);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
