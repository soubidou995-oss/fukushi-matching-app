import { ReactNode, useState } from "react";
import { uploadFacilityPhoto } from "@/lib/storage";

export function Card({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-neutral-200 rounded-xl p-3 mb-2.5 shadow-sm ${
        onClick ? "cursor-pointer hover:border-main/40" : ""
      }`}
    >
      {children}
    </div>
  );
}

const chipStyles: Record<string, string> = {
  open: "bg-[#eaf3ff] text-[#2b5fa8]",
  matched: "bg-[#eafaf0] text-[#268a4e]",
  closed: "bg-neutral-100 text-neutral-500",
  pending: "bg-[#fff4e5] text-[#b9741f]",
  rejected: "bg-[#fde9e8] text-danger",
  default: "bg-main-light text-main",
};

export function Chip({
  tone = "default",
  children,
}: {
  tone?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] ${
        chipStyles[tone] ?? chipStyles.default
      }`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "accent";
  disabled?: boolean;
}) {
  const base =
    "block w-full text-center rounded-[10px] px-3 py-2.5 font-bold text-[13.5px] mt-3.5 disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-main text-white",
    secondary: "bg-white text-main border border-main",
    accent: "bg-accent text-white",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[11.5px] text-neutral-600 mt-2.5 mb-1">
      {children}
    </label>
  );
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`w-full px-2 py-2 border border-neutral-300 rounded-lg text-[13px] ${
        props.className ?? ""
      }`}
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`w-full px-2 py-2 border border-neutral-300 rounded-lg text-[13px] min-h-[70px] resize-y ${
        props.className ?? ""
      }`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={`w-full px-2 py-2 border border-neutral-300 rounded-lg text-[13px] ${
        props.className ?? ""
      }`}
    />
  );
}

export function AppHeader({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <div className="bg-main text-white px-4 py-3.5 font-bold text-[15px] flex items-center gap-2 min-h-[24px]">
      {onBack && (
        <span className="cursor-pointer text-base" onClick={onBack}>
          ←
        </span>
      )}
      {title}
    </div>
  );
}

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex border-t border-neutral-200 bg-white">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 text-center py-2.5 text-[11px] cursor-pointer ${
            active === tab.key ? "text-main font-bold" : "text-gray"
          }`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}

export function PhoneFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-[340px] h-[680px] bg-black rounded-[36px] p-2.5 shadow-xl flex flex-col shrink-0">
      <div className="h-[18px] flex items-center justify-center text-white text-[10px]">
        {label}
      </div>
      <div className="flex-1 bg-card rounded-[26px] overflow-hidden flex flex-col relative">
        {children}
      </div>
    </div>
  );
}

export function AvatarUploader({
  userId,
  value,
  onChange,
  label = "顔写真・代表写真",
}: {
  userId: string;
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFacilityPhoto(userId, file, "avatar");
      onChange(url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="mt-2.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center text-xl text-neutral-300 shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            "👤"
          )}
        </div>
        <label className="text-xs text-main underline cursor-pointer">
          {uploading ? "アップロード中…" : "画像を選択"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
}

export function GalleryUploader({
  userId,
  value,
  onChange,
  label = "施設・職員の写真（複数可）",
}: {
  userId: string;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map((f) => uploadFacilityPhoto(userId, f, "gallery"))
      );
      onChange([...value, ...urls]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="mt-2.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((url) => (
          <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-0 right-0 bg-black/60 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-bl"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="text-xs text-main underline cursor-pointer">
        {uploading ? "アップロード中…" : "写真を追加"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
