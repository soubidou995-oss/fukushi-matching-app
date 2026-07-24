export type ExtraField = {
  key: string;
  label: string;
  placeholder: string;
};

export type FacilityType = {
  id: string;
  label: string;
  nameLabel: string;
  namePlaceholder: string;
  areaLabel: string;
  areaPlaceholder: string;
  bioLabel: string;
  bioPlaceholder: string;
  extraFields: ExtraField[];
};

export const FACILITY_TYPES: FacilityType[] = [
  {
    id: "individual_counselor",
    label: "生活相談員（個人）",
    nameLabel: "氏名",
    namePlaceholder: "山田 太郎",
    areaLabel: "対応可能地域",
    areaPlaceholder: "例：東京都世田谷区・目黒区",
    bioLabel: "自己紹介",
    bioPlaceholder: "経歴や支援方針など",
    extraFields: [
      { key: "qualification", label: "保有資格", placeholder: "例：社会福祉士" },
      { key: "experienceYears", label: "実務経験年数", placeholder: "例：8年" },
    ],
  },
  {
    id: "tokuyou",
    label: "特別養護老人ホーム",
    nameLabel: "施設名",
    namePlaceholder: "例：〇〇特別養護老人ホーム",
    areaLabel: "所在地",
    areaPlaceholder: "例：東京都世田谷区〇〇1-2-3",
    bioLabel: "施設の特徴・自己紹介",
    bioPlaceholder: "施設の方針や特色など",
    extraFields: [
      { key: "capacity", label: "定員", placeholder: "例：80名" },
      { key: "careLevel", label: "受入可能な要介護度", placeholder: "例：要介護3〜5" },
      { key: "vacancy", label: "空き状況", placeholder: "例：現在2名空きあり" },
    ],
  },
  {
    id: "tsuusho_kaigo",
    label: "通所介護（デイサービス）",
    nameLabel: "事業所名",
    namePlaceholder: "例：〇〇デイサービスセンター",
    areaLabel: "所在地",
    areaPlaceholder: "例：埼玉県〇〇市〇〇町1-2-3",
    bioLabel: "施設の特徴・自己紹介",
    bioPlaceholder: "プログラム内容や施設の特色など",
    extraFields: [
      { key: "capacity", label: "定員（1日あたり）", placeholder: "例：30名" },
      { key: "careLevel", label: "対応可能な要介護度", placeholder: "例：要支援1〜要介護5" },
      { key: "transport", label: "送迎の有無", placeholder: "例：あり（片道30分圏内）" },
      { key: "hours", label: "営業時間", placeholder: "例：平日9:00〜17:00" },
    ],
  },
  {
    id: "jido_yougo",
    label: "児童養護施設",
    nameLabel: "施設名",
    namePlaceholder: "例：〇〇児童養護施設",
    areaLabel: "所在地",
    areaPlaceholder: "例：大阪府〇〇市〇〇町1-2-3",
    bioLabel: "施設の特徴・自己紹介",
    bioPlaceholder: "施設の方針や特色など",
    extraFields: [
      { key: "capacity", label: "定員", placeholder: "例：40名" },
      { key: "ageRange", label: "受入対象年齢", placeholder: "例：2歳〜18歳" },
    ],
  },
  {
    id: "houkago_day",
    label: "放課後等デイサービス",
    nameLabel: "事業所名",
    namePlaceholder: "例：〇〇放課後等デイサービス",
    areaLabel: "所在地",
    areaPlaceholder: "例：福岡県福岡市〇〇区1-2-3",
    bioLabel: "施設の特徴・自己紹介",
    bioPlaceholder: "支援内容や施設の特色など",
    extraFields: [
      { key: "targetDisability", label: "対応障害種別", placeholder: "例：知的障害、発達障害" },
      { key: "transport", label: "送迎の有無", placeholder: "例：あり（片道30分圏内）" },
      { key: "hours", label: "開所時間", placeholder: "例：平日13:00〜18:00" },
    ],
  },
  {
    id: "seikatsu_kaigo",
    label: "生活介護",
    nameLabel: "事業所名",
    namePlaceholder: "例：〇〇生活介護事業所",
    areaLabel: "所在地",
    areaPlaceholder: "例：東京都〇〇区1-2-3",
    bioLabel: "施設の特徴・自己紹介",
    bioPlaceholder: "活動内容や施設の特色など",
    extraFields: [
      { key: "capacity", label: "定員", placeholder: "例：20名" },
      { key: "targetDisability", label: "対応障害区分", placeholder: "例：区分3以上" },
      { key: "transport", label: "送迎の有無", placeholder: "例：あり（片道30分圏内）" },
      { key: "hours", label: "営業時間", placeholder: "例：平日9:00〜16:00" },
    ],
  },
  {
    id: "shurou_a",
    label: "就労継続支援A型",
    nameLabel: "事業所名",
    namePlaceholder: "例：〇〇就労継続支援A型事業所",
    areaLabel: "所在地",
    areaPlaceholder: "例：東京都〇〇区1-2-3",
    bioLabel: "作業内容・特徴",
    bioPlaceholder: "作業内容や職場の雰囲気など",
    extraFields: [
      { key: "wage", label: "賃金の目安", placeholder: "例：時給1,000円〜" },
      { key: "workContent", label: "主な作業内容", placeholder: "例：軽作業、清掃など" },
    ],
  },
  {
    id: "shurou_b",
    label: "就労継続支援B型",
    nameLabel: "事業所名",
    namePlaceholder: "例：〇〇就労継続支援B型事業所",
    areaLabel: "所在地",
    areaPlaceholder: "例：東京都〇〇区1-2-3",
    bioLabel: "作業内容・特徴",
    bioPlaceholder: "作業内容や職場の雰囲気など",
    extraFields: [
      { key: "wage", label: "工賃の目安", placeholder: "例：月1万円〜" },
      { key: "workContent", label: "主な作業内容", placeholder: "例：軽作業、農作業など" },
    ],
  },
  {
    id: "houmon_kaigo",
    label: "訪問介護",
    nameLabel: "事業所名",
    namePlaceholder: "例：〇〇訪問介護事業所",
    areaLabel: "対応エリア",
    areaPlaceholder: "例：東京都23区全域",
    bioLabel: "サービスの特徴・自己紹介",
    bioPlaceholder: "サービスの方針や特色など",
    extraFields: [
      { key: "serviceHours", label: "サービス提供時間", placeholder: "例：24時間対応可" },
      { key: "staffQualifications", label: "保有資格スタッフ数", placeholder: "例：介護福祉士3名" },
    ],
  },
  {
    id: "gh",
    label: "障害者グループホーム",
    nameLabel: "施設名",
    namePlaceholder: "例：〇〇グループホーム",
    areaLabel: "所在地",
    areaPlaceholder: "例：神奈川県〇〇市1-2-3",
    bioLabel: "施設の特徴・自己紹介",
    bioPlaceholder: "施設の方針や特色など",
    extraFields: [
      { key: "capacity", label: "定員", placeholder: "例：10名" },
      { key: "targetDisability", label: "対応障害種別", placeholder: "例：知的障害、精神障害" },
    ],
  },
  {
    id: "other",
    label: "その他",
    nameLabel: "名称",
    namePlaceholder: "施設・事業所名など",
    areaLabel: "所在地・対応エリア",
    areaPlaceholder: "所在地または対応エリアを入力してください",
    bioLabel: "サービス内容・特徴",
    bioPlaceholder: "サービス内容や特色など自由にご記入ください",
    extraFields: [],
  },
];

export function getFacilityType(id: string): FacilityType {
  return FACILITY_TYPES.find((t) => t.id === id) ?? FACILITY_TYPES[FACILITY_TYPES.length - 1];
}
