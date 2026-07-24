import Link from "next/link";
import type { ReactNode } from "react";

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      {children}
    </svg>
  );
}

function HomeIcon() {
  return (
    <IconWrap>
      <path d="M2.25 12l8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </IconWrap>
  );
}

function UsersIcon() {
  return (
    <IconWrap>
      <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </IconWrap>
  );
}

function ShieldIcon() {
  return (
    <IconWrap>
      <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </IconWrap>
  );
}

const apps = [
  {
    href: "/family",
    title: "ご家族アプリ",
    desc: "生活相談員を探してリクエストを投稿",
    note: "ご利用は無料です",
    icon: HomeIcon,
  },
  {
    href: "/counselor",
    title: "生活相談員・施設アプリ",
    desc: "案件を探して応募・対応する",
    note: "生活相談員／各種施設・事業所向け",
    icon: UsersIcon,
  },
  {
    href: "/admin",
    title: "管理画面",
    desc: "相談員審査・月額料金設定・マッチング状況",
    note: "運営担当者向け（Web）",
    icon: ShieldIcon,
  },
];

const LEAF_PATTERN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='%232e5e4e' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M28 24c14 6 14 26 0 32-14-6-14-26 0-32Z'/%3E%3Cpath d='M28 24v32'/%3E%3C/g%3E%3Cg fill='none' stroke='%23d98c3d' stroke-width='2' stroke-linecap='round' transform='rotate(35 122 96)'%3E%3Cpath d='M122 80c12 5 12 22 0 27-12-5-12-22 0-27Z'/%3E%3Cpath d='M122 80v27'/%3E%3C/g%3E%3Cg fill='none' stroke='%232e5e4e' stroke-width='2' stroke-linecap='round' transform='rotate(-20 70 130)'%3E%3Cpath d='M70 116c11 4.5 11 20 0 24.5-11-4.5-11-20 0-24.5Z'/%3E%3Cpath d='M70 116v24.5'/%3E%3C/g%3E%3C/svg%3E";

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#f7f3ea]">
      {/* organic blurred color blobs */}
      <div className="pointer-events-none absolute -left-24 -top-32 h-[26rem] w-[26rem] animate-blob-a rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-main/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-[-4rem] h-[24rem] w-[24rem] animate-blob-b rounded-[40%_60%_70%_30%/50%_60%_40%_50%] bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/3 h-[22rem] w-[22rem] animate-blob-a rounded-[50%_50%_40%_60%/40%_50%_60%_50%] bg-main/15 blur-3xl" />

      {/* warm base gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.5),transparent_60%)]" />

      {/* nature texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("${LEAF_PATTERN}")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* fine grain for a designed, tactile feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      <div className="relative flex flex-col items-center px-4 py-20 sm:py-28">
        <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-main to-[#1f3d33] shadow-[0_10px_30px_rgba(46,94,78,0.25)]">
          <span className="flex -space-x-1.5">
            <span className="h-4 w-4 rounded-full bg-white/90" />
            <span className="h-4 w-4 rounded-full bg-accent" />
          </span>
        </span>

        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
          Welfare Matching Platform
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-main sm:text-4xl">
          全国福祉マッチングアプリ
        </h1>
        <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-neutral-600">
          ご家族・生活相談員／施設・運営をつなぐ福祉マッチングサービス。
          <br />
          利用するアプリを選択してください。
        </p>

        <div className="mt-12 grid w-full max-w-4xl gap-5 sm:grid-cols-3">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link
                key={app.href}
                href={app.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-main/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-main/10"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />

                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-main-light text-main transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon />
                </span>
                <h2 className="font-bold text-neutral-800">{app.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                  {app.desc}
                </p>
                <span className="mt-4 inline-flex w-fit items-center rounded-full bg-main-light px-2.5 py-1 text-[11px] font-medium text-main">
                  {app.note}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                  開く
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-16 text-center text-[11px] text-neutral-400">
          ご家族の利用は無料です。生活相談員・登録事業者には月額利用料金をいただくモデルで運営しています。
        </p>
        <Link
          href="/privacy"
          className="mt-3 text-[11px] text-neutral-400 underline hover:text-main"
        >
          プライバシーポリシー
        </Link>
      </div>
    </div>
  );
}
