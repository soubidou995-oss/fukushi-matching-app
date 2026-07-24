import Link from "next/link";

const apps = [
  {
    href: "/family",
    title: "ご家族アプリ",
    desc: "生活相談員を探してリクエストを投稿",
    note: "ご利用は無料です",
    icon: "🏠",
  },
  {
    href: "/counselor",
    title: "生活相談員・施設アプリ",
    desc: "案件を探して応募・対応する",
    note: "生活相談員／各種施設・事業所向け",
    icon: "🤝",
  },
  {
    href: "/admin",
    title: "管理画面",
    desc: "相談員審査・月額料金設定・マッチング状況",
    note: "運営担当者向け（Web）",
    icon: "🗂️",
  },
];

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#f4f5f3]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, rgba(46,94,78,0.14), transparent 45%), radial-gradient(circle at 85% 0%, rgba(217,140,61,0.14), transparent 40%)",
        }}
      />

      <div className="relative flex flex-col items-center px-4 py-20 sm:py-28">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-main text-3xl shadow-lg shadow-main/20">
          🤝
        </span>

        <h1 className="text-center text-3xl font-bold tracking-tight text-main sm:text-4xl">
          全国福祉マッチングアプリ
        </h1>
        <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-neutral-500">
          ご家族・生活相談員／施設・運営をつなぐ福祉マッチングサービス。
          <br />
          利用するアプリを選択してください。
        </p>

        <div className="mt-12 grid w-full max-w-4xl gap-5 sm:grid-cols-3">
          {apps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative flex flex-col rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-main/50 hover:shadow-xl hover:shadow-main/10"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-main-light text-2xl transition-transform duration-200 group-hover:scale-110">
                {app.icon}
              </span>
              <h2 className="font-bold text-neutral-800">{app.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                {app.desc}
              </p>
              <span className="mt-4 inline-flex w-fit items-center rounded-full bg-main-light px-2.5 py-1 text-[11px] font-medium text-main">
                {app.note}
              </span>
              <span className="mt-4 text-xs font-medium text-main opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                開く →
              </span>
            </Link>
          ))}
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
