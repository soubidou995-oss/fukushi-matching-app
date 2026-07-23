import { ReactNode } from "react";

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
