import Link from "next/link";

export const metadata = {
  title: "利用規約 | 全国福祉マッチングアプリ",
};

export default function TermsPage() {
  return (
    <div className="flex-1 bg-[#f4f5f3] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <Link href="/" className="text-xs text-main underline">
          ← トップに戻る
        </Link>
        <h1 className="mt-4 text-xl font-bold text-main">利用規約</h1>
        <p className="mt-2 text-xs text-neutral-400">
          ※本ページはひな形です。正式公開前に専門家（弁護士等）の確認を受けてください。
        </p>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-neutral-700">
          <section>
            <h2 className="font-bold text-main">第1条（適用）</h2>
            <p className="mt-1">
              本規約は、全国福祉マッチングアプリ（以下「本サービス」）の利用に関する条件を定めるものです。ご家族、生活相談員、福祉施設・事業所（以下あわせて「登録事業者」）、その他すべての利用者（以下「ユーザー」）は、本規約に同意の上、本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第2条（サービス内容）</h2>
            <p className="mt-1">
              本サービスは、ご家族と生活相談員・登録事業者とのマッチングの場を提供するプラットフォームです。本サービスは両者間の連絡・マッチングの機会を提供するものであり、実際の支援サービスの提供者ではありません。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第3条（登録）</h2>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>ユーザーは真実かつ正確な情報を登録するものとします。</li>
              <li>
                生活相談員・登録事業者は、資格・実績等について運営による審査を受け、承認された後に案件への応募が可能となります。運営は合理的な理由に基づき、登録を承認しないことがあります。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-main">第4条（利用料金）</h2>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>ご家族による本サービスの利用は無料です。</li>
              <li>
                生活相談員・登録事業者は、管理画面に表示される月額利用料金を運営が定める方法により支払うものとします。金額は運営が随時変更できるものとし、変更後は次回請求分から適用されます。
              </li>
              <li>マッチングの成立自体に対する成功報酬・手数料は発生しません。</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-main">第5条（禁止事項）</h2>
            <p className="mt-1">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>虚偽の情報を登録する行為</li>
              <li>他のユーザーになりすます行為</li>
              <li>本サービスを介さずに直接契約を行うことを目的として、本サービスを不当に利用する行為</li>
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-main">第6条（マッチング当事者間の責任）</h2>
            <p className="mt-1">
              マッチング成立後の支援内容・料金・契約関係は、ご家族と生活相談員・登録事業者の間で直接取り決めるものとし、本サービスはその内容について責任を負いません。ユーザー間で生じたトラブルは、原則として当事者間で解決するものとします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第7条（免責事項）</h2>
            <p className="mt-1">
              運営は、本サービスに掲載される情報の正確性・有用性、および生活相談員・登録事業者が提供する支援サービスの質について保証するものではありません。運営は、本サービスの利用により生じた損害について、運営の故意または重過失による場合を除き、責任を負わないものとします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第8条（登録抹消等）</h2>
            <p className="mt-1">
              運営は、ユーザーが本規約に違反した場合その他運営が必要と判断した場合、事前の通知なく、当該ユーザーの登録抹消・利用停止等の措置を講じることができるものとします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第9条（サービス内容の変更・中断・終了）</h2>
            <p className="mt-1">
              運営は、ユーザーへの事前の通知なく、本サービスの内容を変更し、または提供を中断・終了することができるものとします。これによりユーザーに生じた損害について、運営は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第10条（規約の変更）</h2>
            <p className="mt-1">
              運営は、必要と判断した場合には、ユーザーに通知することなく本規約を変更できるものとします。変更後の規約は、本サービス上に掲示した時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="font-bold text-main">第11条（準拠法・管轄裁判所）</h2>
            <p className="mt-1">
              本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営の本店所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
