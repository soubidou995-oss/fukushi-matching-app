import Link from "next/link";

const apps = [
  {
    href: "/family",
    title: "ご家族アプリ",
    desc: "生活相談員を探してリクエストを投稿（利用無料）",
  },
  {
    href: "/counselor",
    title: "生活相談員アプリ",
    desc: "案件を探して応募・対応する",
  },
  {
    href: "/admin",
    title: "管理画面（Web）",
    desc: "相談員審査・月額料金設定・マッチング状況",
  },
];

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-background">
      <h1 className="text-2xl font-bold text-main mb-2">
        全国福祉マッチングアプリ
      </h1>
      <p className="text-sm text-gray mb-8">
        利用するアプリを選択してください
      </p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:border-main transition-colors"
          >
            <h2 className="font-bold text-main">{app.title}</h2>
            <p className="text-xs text-neutral-500 mt-1">{app.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
