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
  TabBar,
  Textarea,
} from "@/components/ui";
import type {
  Application,
  CounselorProfile,
  FamilyRequest,
  Profile,
} from "@/lib/types";
import { FACILITY_TYPES, getFacilityType } from "@/lib/facilityTypes";

type Screen =
  | "auth"
  | "select-type"
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

  const [facilityTypeId, setFacilityTypeId] = useState("individual_counselor");
  const [regForm, setRegForm] = useState({
    name: "",
    area: "",
    bio: "",
    extra: {} as Record<string, string>,
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
    area: "",
    bio: "",
    extra: {} as Record<string, string>,
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
          area: (cp.areas ?? []).join("・"),
          bio: cp.bio ?? "",
          extra: (cp.extra_fields as Record<string, string>) ?? {},
        });
        if (cp.status === "approved") {
          setScreen("home");
          loadOpenRequests(userId);
        } else {
          setScreen("pending");
        }
      } else {
        setScreen("select-type");
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

    const isIndividual = facilityTypeId === "individual_counselor";

    await supabase.from("profiles").upsert({
      id: userId,
      role: "counselor",
      name: regForm.name,
    });
    const { error } = await supabase.from("counselor_profiles").insert({
      id: userId,
      facility_type: facilityTypeId,
      qualifications: isIndividual ? regForm.extra.qualification ?? null : null,
      experience_years: isIndividual
        ? Number(regForm.extra.experienceYears) || null
        : null,
      areas: regForm.area.split(/[・,、\s]+/).filter(Boolean),
      bio: regForm.bio,
      extra_fields: regForm.extra,
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
    const isIndividual = counselorProfile.facility_type === "individual_counselor";
    const { error } = await supabase
      .from("counselor_profiles")
      .update({
        qualifications: isIndividual ? editForm.extra.qualification ?? null : null,
        experience_years: isIndividual
          ? Number(editForm.extra.experienceYears) || null
          : null,
        areas: editForm.area.split(/[・,、\s]+/).filter(Boolean),
        bio: editForm.bio,
        extra_fields: editForm.extra,
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

          {screen === "select-type" && (
            <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
              <AppHeader title="登録する種別を選択" />
              <div className="p-3.5">
                <p className="text-[11px] text-gray mb-2">
                  該当する種別を選択してください。種別に応じて次の入力項目が変わります。
                </p>
                {FACILITY_TYPES.map((t) => (
                  <Card
                    key={t.id}
                    onClick={() => {
                      setFacilityTypeId(t.id);
                      setRegForm({ name: "", area: "", bio: "", extra: {} });
                      setScreen("register");
                    }}
                  >
                    <h4 className="font-bold text-[13.5px]">{t.label}</h4>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {screen === "register" &&
            (() => {
              const ft = getFacilityType(facilityTypeId);
              return (
                <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
                  <AppHeader
                    title="事前登録"
                    onBack={() => setScreen("select-type")}
                  />
                  <div className="p-3.5">
                    <Chip>{ft.label}</Chip>
                    <Label>{ft.nameLabel}</Label>
                    <Input
                      value={regForm.name}
                      onChange={(e) =>
                        setRegForm({ ...regForm, name: e.target.value })
                      }
                      placeholder={ft.namePlaceholder}
                    />
                    {ft.extraFields.map((f) => (
                      <div key={f.key}>
                        <Label>{f.label}</Label>
                        <Input
                          value={regForm.extra[f.key] ?? ""}
                          onChange={(e) =>
                            setRegForm({
                              ...regForm,
                              extra: { ...regForm.extra, [f.key]: e.target.value },
                            })
                          }
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                    <Label>{ft.areaLabel}</Label>
                    <Input
                      value={regForm.area}
                      onChange={(e) =>
                        setRegForm({ ...regForm, area: e.target.value })
                      }
                      placeholder={ft.areaPlaceholder}
                    />
                    <Label>{ft.bioLabel}</Label>
                    <Textarea
                      value={regForm.bio}
                      onChange={(e) =>
                        setRegForm({ ...regForm, bio: e.target.value })
                      }
                      placeholder={ft.bioPlaceholder}
                    />
                    <Button onClick={submitRegistration}>
                      登録申請を送信する
                    </Button>
                  </div>
                </div>
              );
            })()}

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

          {screen === "profile" && counselorProfile &&
            (() => {
              const ft = getFacilityType(counselorProfile.facility_type);
              return (
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader title="プロフィール編集" />
              <div className="flex-1 overflow-y-auto p-3.5 text-[13px]">
                <Chip>{ft.label}</Chip>
                <Label>{ft.nameLabel}</Label>
                <Input value={profile?.name ?? ""} disabled />
                {ft.extraFields.map((f) => (
                  <div key={f.key}>
                    <Label>{f.label}</Label>
                    <Input
                      value={editForm.extra[f.key] ?? ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          extra: { ...editForm.extra, [f.key]: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
                <Label>{ft.areaLabel}</Label>
                <Input
                  value={editForm.area}
                  onChange={(e) =>
                    setEditForm({ ...editForm, area: e.target.value })
                  }
                />
                <Label>{ft.bioLabel}</Label>
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
              );
            })()}
        </div>
      </div>
    </div>
  );
}
