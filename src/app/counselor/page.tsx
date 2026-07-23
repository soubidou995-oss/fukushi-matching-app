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
  Profile,
} from "@/lib/types";

type Screen =
  | "auth"
  | "register"
  | "pending"
  | "home"
  | "request-detail"
  | "applications"
  | "profile";

export default function CounselorApp() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [counselorProfile, setCounselorProfile] =
    useState<CounselorProfile | null>(null);
  const [screen, setScreen] = useState<Screen>("auth");
  const [tab, setTab] = useState<"home" | "applications" | "profile">("home");

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const [regForm, setRegForm] = useState({
    name: "",
    qualifications: "社会福祉士",
    experience_years: "",
    areas: "",
    bio: "",
  });

  const [openRequests, setOpenRequests] = useState<FamilyRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FamilyRequest | null>(
    null
  );
  const [proposal, setProposal] = useState("");
  const [myApplications, setMyApplications] = useState<
    (Application & { request?: FamilyRequest })[]
  >([]);

  const [editForm, setEditForm] = useState({
    qualifications: "",
    areas: "",
    bio: "",
  });
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        loadAll(data.session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function loadAll(userId: string) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (prof) {
      setProfile(prof as Profile);
      const { data: cp } = await supabase
        .from("counselor_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (cp) {
        setCounselorProfile(cp as CounselorProfile);
        setEditForm({
          qualifications: cp.qualifications ?? "",
          areas: (cp.areas ?? []).join("・"),
          bio: cp.bio ?? "",
        });
        if (cp.status === "approved") {
          setScreen("home");
          loadOpenRequests(userId);
        } else {
          setScreen("pending");
        }
      } else {
        setScreen("register");
      }
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
    if (data.user) loadAll(data.user.id);
  }

  async function handleSignup() {
    setAuthError(null);
    setAuthNotice(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (!data.session) {
      setAuthNotice(
        "確認メールを送信しました。確認後にログインしてください。"
      );
      return;
    }
    loadAll(data.user!.id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setProfile(null);
    setCounselorProfile(null);
    setScreen("auth");
  }

  async function submitRegistration() {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
    if (!userId) return;
    if (!regForm.name.trim()) return;

    await supabase.from("profiles").upsert({
      id: userId,
      role: "counselor",
      name: regForm.name,
    });
    const { error } = await supabase.from("counselor_profiles").insert({
      id: userId,
      qualifications: regForm.qualifications,
      experience_years: Number(regForm.experience_years) || null,
      areas: regForm.areas.split(/[・,、\s]+/).filter(Boolean),
      bio: regForm.bio,
      status: "pending",
    });
    if (!error) {
      loadAll(userId);
    }
  }

  async function loadOpenRequests(counselorId: string) {
    const { data: reqs } = await supabase
      .from("requests")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });
    const { data: myApps } = await supabase
      .from("applications")
      .select("request_id")
      .eq("counselor_id", counselorId);
    const appliedIds = new Set((myApps ?? []).map((a) => a.request_id));
    setOpenRequests(
      ((reqs as FamilyRequest[]) ?? []).filter((r) => !appliedIds.has(r.id))
    );
  }

  async function loadApplications(counselorId: string) {
    const { data: apps } = await supabase
      .from("applications")
      .select("*")
      .eq("counselor_id", counselorId)
      .order("created_at", { ascending: false });
    const list = (apps as Application[]) ?? [];
    const reqIds = list.map((a) => a.request_id);
    let reqMap: Record<string, FamilyRequest> = {};
    if (reqIds.length > 0) {
      const { data: reqs } = await supabase
        .from("requests")
        .select("*")
        .in("id", reqIds);
      (reqs as FamilyRequest[] | null)?.forEach((r) => (reqMap[r.id] = r));
    }
    setMyApplications(list.map((a) => ({ ...a, request: reqMap[a.request_id] })));
  }

  async function applyToRequest() {
    if (!counselorProfile || !selectedRequest) return;
    const { error } = await supabase.from("applications").insert({
      request_id: selectedRequest.id,
      counselor_id: counselorProfile.id,
      message: proposal,
      status: "pending",
    });
    if (!error) {
      setProposal("");
      await loadApplications(counselorProfile.id);
      await loadOpenRequests(counselorProfile.id);
      setTab("applications");
      setScreen("applications");
    }
  }

  async function saveProfile() {
    if (!counselorProfile) return;
    const { error } = await supabase
      .from("counselor_profiles")
      .update({
        qualifications: editForm.qualifications,
        areas: editForm.areas.split(/[・,、\s]+/).filter(Boolean),
        bio: editForm.bio,
      })
      .eq("id", counselorProfile.id);
    if (!error) {
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
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
          生活相談員アプリ
        </div>
        <div className="flex-1 bg-white rounded-[26px] overflow-hidden flex flex-col relative">
          {screen === "auth" && (
            <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
              <AppHeader title="生活相談員 ログイン" />
              <div className="p-3.5">
                <Label>メールアドレス</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Label>パスワード</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  新規登録（アカウント作成）
                </Button>
              </div>
            </div>
          )}

          {screen === "register" && (
            <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
              <AppHeader title="生活相談員 事前登録" />
              <div className="p-3.5">
                <Label>氏名</Label>
                <Input
                  value={regForm.name}
                  onChange={(e) =>
                    setRegForm({ ...regForm, name: e.target.value })
                  }
                  placeholder="山田 太郎"
                />
                <Label>保有資格</Label>
                <Select
                  value={regForm.qualifications}
                  onChange={(e) =>
                    setRegForm({ ...regForm, qualifications: e.target.value })
                  }
                >
                  <option>社会福祉士</option>
                  <option>介護支援専門員</option>
                  <option>精神保健福祉士</option>
                  <option>その他</option>
                </Select>
                <Label>実務経験年数</Label>
                <Input
                  value={regForm.experience_years}
                  onChange={(e) =>
                    setRegForm({ ...regForm, experience_years: e.target.value })
                  }
                  placeholder="例：8"
                />
                <Label>対応可能地域</Label>
                <Input
                  value={regForm.areas}
                  onChange={(e) =>
                    setRegForm({ ...regForm, areas: e.target.value })
                  }
                  placeholder="例：東京都世田谷区・目黒区"
                />
                <Label>自己紹介</Label>
                <Textarea
                  value={regForm.bio}
                  onChange={(e) =>
                    setRegForm({ ...regForm, bio: e.target.value })
                  }
                  placeholder="経歴や支援方針など"
                />
                <Button onClick={submitRegistration}>登録申請を送信する</Button>
              </div>
            </div>
          )}

          {screen === "pending" && (
            <div className="flex-1 overflow-y-auto p-3.5">
              <AppHeader title="審査状況" />
              <div className="text-center pt-14">
                <p className="text-3xl">⏳</p>
                <h3 className="font-bold mt-2">
                  審査中です <Chip tone="pending">審査中</Chip>
                </h3>
                <p className="text-[11px] text-gray mt-2 px-4">
                  運営による確認後、案件への応募が可能になります。
                </p>
              </div>
            </div>
          )}

          {screen === "home" && counselorProfile && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="案件一覧" />
              <div className="flex-1 overflow-y-auto p-3.5">
                {openRequests.length === 0 && (
                  <p className="text-xs text-gray text-center mt-8">
                    現在募集中の案件はありません
                  </p>
                )}
                {openRequests.map((r) => (
                  <Card
                    key={r.id}
                    onClick={() => {
                      setSelectedRequest(r);
                      setScreen("request-detail");
                    }}
                  >
                    <h4 className="text-[13.5px] font-bold mb-1">
                      {r.title} <Chip tone="open">募集中</Chip>
                    </h4>
                    <p className="text-xs text-neutral-500">{r.area}</p>
                  </Card>
                ))}
              </div>
              <TabBar
                tabs={[
                  { key: "home", label: "案件一覧" },
                  { key: "applications", label: "応募状況" },
                  { key: "profile", label: "プロフィール" },
                ]}
                active={tab}
                onChange={(k) => {
                  setTab(k as typeof tab);
                  if (k === "applications") loadApplications(counselorProfile.id);
                  setScreen(k as Screen);
                }}
              />
            </div>
          )}

          {screen === "request-detail" && selectedRequest && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="案件詳細" onBack={() => setScreen("home")} />
              <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
                <h4 className="font-bold">{selectedRequest.title}</h4>
                <p>
                  地域：{selectedRequest.area}／頻度：
                  {selectedRequest.frequency || "-"}
                </p>
                <p>予算感：{selectedRequest.budget || "-"}</p>
                <p>詳細：{selectedRequest.memo}</p>
                <Label>提案メッセージ</Label>
                <Textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="対応可能日時やご提案を入力してください"
                />
                <Button onClick={applyToRequest}>この案件に応募する</Button>
              </div>
            </div>
          )}

          {screen === "applications" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="応募状況" />
              <div className="flex-1 overflow-y-auto p-3.5">
                {myApplications.length === 0 && (
                  <p className="text-xs text-gray text-center mt-8">
                    まだ応募がありません
                  </p>
                )}
                {myApplications.map((a) => (
                  <Card key={a.id}>
                    <h4 className="text-[13.5px] font-bold">
                      {a.request?.title}{" "}
                      <Chip
                        tone={
                          a.status === "matched"
                            ? "matched"
                            : a.status === "rejected"
                            ? "rejected"
                            : "pending"
                        }
                      >
                        {a.status === "matched"
                          ? "マッチング成立"
                          : a.status === "rejected"
                          ? "不採用"
                          : "応募中"}
                      </Chip>
                    </h4>
                  </Card>
                ))}
              </div>
              <TabBar
                tabs={[
                  { key: "home", label: "案件一覧" },
                  { key: "applications", label: "応募状況" },
                  { key: "profile", label: "プロフィール" },
                ]}
                active={tab}
                onChange={(k) => {
                  setTab(k as typeof tab);
                  if (k === "home" && counselorProfile)
                    loadOpenRequests(counselorProfile.id);
                  setScreen(k as Screen);
                }}
              />
            </div>
          )}

          {screen === "profile" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="プロフィール編集" />
              <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
                <Label>氏名</Label>
                <Input value={profile?.name ?? ""} disabled />
                <Label>保有資格</Label>
                <Input
                  value={editForm.qualifications}
                  onChange={(e) =>
                    setEditForm({ ...editForm, qualifications: e.target.value })
                  }
                />
                <Label>対応可能地域</Label>
                <Input
                  value={editForm.areas}
                  onChange={(e) =>
                    setEditForm({ ...editForm, areas: e.target.value })
                  }
                />
                <Label>自己紹介</Label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                />
                <Button onClick={saveProfile}>保存する</Button>
                {savedNotice && (
                  <p className="text-main text-xs mt-2 text-center">
                    保存しました
                  </p>
                )}
              </div>
              <TabBar
                tabs={[
                  { key: "home", label: "案件一覧" },
                  { key: "applications", label: "応募状況" },
                  { key: "profile", label: "プロフィール" },
                ]}
                active={tab}
                onChange={(k) => {
                  setTab(k as typeof tab);
                  if (k === "home" && counselorProfile)
                    loadOpenRequests(counselorProfile.id);
                  if (k === "applications" && counselorProfile)
                    loadApplications(counselorProfile.id);
                  setScreen(k as Screen);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
