import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | 全国福祉マッチングアプリ",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-[#f4f5f3] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <Link href="/" className="text-xs text-main underline">
          ← トップに戻る
        </Link>
        <h1 className="mt-4 text-xl font-bold text-main">
          プライバシーポリシー
        </h1>
        <p className="mt-2 text-xs text-neutral-400">
          ※本ページはひな形です。正式公開前に専門家（弁護士等）の確認を受けてください。
        </p>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-neutral-700">
          <section>
            <h2 className="font-bold text-main">1. 基本方針</h2>
            <p className="mt-1">
              全国福祉マッチングアプリ（以下「本サービス」）は、ご利用者（ご家族・生活相談員・福祉施設等の登録事業者）の個人情報の重要性を認識し、個人情報の保護に関する法律その他の関連法令を遵守し、適切に取り扱います。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">2. 取得する情報</h2>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>氏名・施設名、メールアドレス、電話番号などの登録情報</li>
              <li>資格情報、実務経験、対応地域、自己紹介文などのプロフィール情報</li>
              <li>顔写真・施設写真等のアップロードされた画像</li>
              <li>リクエスト内容、応募メッセージ、チャットのメッセージ内容</li>
              <li>本人確認書類・資格証明書類（該当する場合）</li>
              <li>サービス利用状況に関するログ情報</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-main">3. 利用目的</h2>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>ご家族と生活相談員・登録事業者とのマッチングの提供</li>
              <li>生活相談員・登録事業者の本人確認・資格確認・審査</li>
              <li>月額利用料金の請求・決済（生活相談員・登録事業者向け）</li>
              <li>お問い合わせへの対応、重要なお知らせの送付</li>
              <li>サービス改善のための分析</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-main">4. 第三者提供</h2>
            <p className="mt-1">
              法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。マッチング成立後、必要な範囲でご家族と生活相談員・登録事業者の間に限り情報を共有します。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">5. 委託先</h2>
            <p className="mt-1">
              本サービスはデータベース・認証基盤としてSupabase
              Inc.のサービスを利用しています。適切な安全管理措置を講じた上で、業務委託先として情報を取り扱います。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">6. 開示・訂正・削除等の請求</h2>
            <p className="mt-1">
              ご本人からの個人情報の開示・訂正・利用停止・削除等のご請求には、本人確認の上、法令に従って適切に対応します。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">7. お問い合わせ窓口</h2>
            <p className="mt-1">
              本サービスの個人情報の取り扱いに関するお問い合わせは、アプリ内の「お問い合わせ」よりご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">8. 改定</h2>
            <p className="mt-1">
              本ポリシーの内容は、法令の変更やサービス内容の変更に応じて、予告なく改定することがあります。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
