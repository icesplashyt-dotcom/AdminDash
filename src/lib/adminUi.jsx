import React from "react";
import { Smartphone, DollarSign, Landmark, MessageCircle, CreditCard } from "lucide-react";

export const providerMeta = {
  mtn: { bg: "bg-amber-100", fg: "text-amber-600", label: "MTN" },
  orange: { bg: "bg-orange-100", fg: "text-orange-600", label: "Orange" },
  alipay: { bg: "bg-blue-100", fg: "text-blue-600", label: "Alipay" },
  wechat: { bg: "bg-green-100", fg: "text-green-600", label: "WeChat" },
  bank: { bg: "bg-indigo-100", fg: "text-indigo-600", label: "Bank" },
  bank_transfer: { bg: "bg-indigo-100", fg: "text-indigo-600", label: "Bank Transfer" },
  cash_rmb: { bg: "bg-emerald-100", fg: "text-emerald-600", label: "Cash RMB" },
  card: { bg: "bg-slate-200", fg: "text-slate-600", label: "Card" },
  visa: { bg: "bg-slate-100", fg: "text-slate-700", label: "Visa" },
  mastercard: { bg: "bg-slate-100", fg: "text-slate-700", label: "Mastercard" },
  amex: { bg: "bg-slate-100", fg: "text-slate-700", label: "Amex" },
  unknown: { bg: "bg-slate-100", fg: "text-slate-500", label: "Transfer" },
};

export function fmtFcfa(n) {
  const v = Number(n || 0);
  if (v >= 1000000) return `₣${(v / 1000000).toFixed(2)}M`;
  if (v >= 1000) return `₣${(v / 1000).toFixed(0)}K`;
  return `₣${v.toFixed(0)}`;
}
export function fmtRmb(n) {
  return `¥${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
export function fmtTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
export function fmtDateTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function Avatar({ url, name, size = 32 }) {
  const [failed, setFailed] = React.useState(false);
  const initials = (name || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name || ""}
        onError={() => setFailed(true)}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-slate-700 font-semibold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

export function BrandIcon({ code, size = 20 }) {
  const c = (code || "").toLowerCase();
  const base = "flex items-center justify-center shrink-0";
  if (c === "mtn") {
    return (
      <div className={`${base} rounded-full`} style={{ width: size, height: size, background: "#FFCB05", border: "1.5px solid #17162B" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 800, color: "#17162B", letterSpacing: "-0.3px" }}>MTN</span>
      </div>
    );
  }
  if (c === "orange") {
    return (
      <div className={`${base} rounded-full`} style={{ width: size, height: size, background: "#FF7900" }}>
        <span style={{ fontSize: size * 0.26, fontWeight: 800, color: "#FFFFFF", fontStyle: "italic" }}>orange</span>
      </div>
    );
  }
  if (c === "alipay") {
    return (
      <div className={`${base} rounded-full`} style={{ width: size, height: size, background: "#1677FF" }}>
        <span style={{ fontSize: size * 0.5, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>支</span>
      </div>
    );
  }
  if (c === "wechat") {
    return (
      <div className={`${base} rounded-full`} style={{ width: size, height: size, background: "#07C160" }}>
        <MessageCircle size={size * 0.55} color="#FFFFFF" strokeWidth={2.4} />
      </div>
    );
  }
  if (c === "visa") {
    return (
      <div className={`${base} rounded-md border border-slate-200 bg-white`} style={{ width: size * 1.6, height: size }}>
        <span style={{ fontSize: size * 0.38, fontWeight: 800, color: "#1A1F71", fontStyle: "italic" }}>VISA</span>
      </div>
    );
  }
  if (c === "mastercard") {
    return (
      <div className={`${base} rounded-md`} style={{ width: size * 1.6, height: size, background: "#16171D" }}>
        <div className="flex items-center">
          <div style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: "#EB4B4B" }} />
          <div style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: "#F5A623", opacity: 0.9, marginLeft: -size * 0.16 }} />
        </div>
      </div>
    );
  }
  if (c === "cash_rmb") {
    return (
      <div className={`${base} rounded-full bg-emerald-50`} style={{ width: size, height: size }}>
        <DollarSign size={size * 0.55} color="#059669" />
      </div>
    );
  }
  if (c === "bank" || c === "bank_transfer") {
    return (
      <div className={`${base} rounded-full bg-indigo-50`} style={{ width: size, height: size }}>
        <Landmark size={size * 0.55} color="#4F46E5" />
      </div>
    );
  }
  return (
    <div className={`${base} rounded-md border border-slate-200 bg-slate-50`} style={{ width: size * 1.4, height: size }}>
      <CreditCard size={size * 0.55} color="#64748b" />
    </div>
  );
}

export function Tag({ code }) {
  const m = providerMeta[(code || "").toLowerCase()] || { bg: "bg-slate-100", fg: "text-slate-600", label: code || "—" };
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <BrandIcon code={code} size={19} />
      <span className={`text-xs font-semibold ${m.fg}`}>{m.label}</span>
    </span>
  );
}

export function StatusPill({ status }) {
  const map = {
    completed: "bg-emerald-100 text-emerald-600",
    approved: "bg-emerald-100 text-emerald-600",
    pending: "bg-orange-100 text-orange-600",
    processing: "bg-blue-100 text-blue-600",
    verifying: "bg-blue-100 text-blue-600",
    failed: "bg-rose-100 text-rose-600",
    rejected: "bg-rose-100 text-rose-600",
  };
  return (
    <span className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export function SectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-[20px] font-bold text-slate-900 sm:text-[22px]">{title}</h1>
      {subtitle && <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search..."}
      className="w-full max-w-xs rounded-xl border border-slate-200 px-3.5 py-2.5 text-[13px] outline-none focus:border-violet-400"
    />
  );
}

export function EmptyState({ label }) {
  return <div className="py-10 text-center text-[13px] text-slate-400">{label}</div>;
}

export function LoadingState() {
  return <div className="py-10 text-center text-[13px] text-slate-400">Loading…</div>;
}
