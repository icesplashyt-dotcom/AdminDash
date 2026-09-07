import React from "react";
import { Smartphone, DollarSign, Landmark, MessageCircle, CreditCard } from "lucide-react";

// Real Alipay logo asset, reused from the Rmbpay2 user app.
const ALIPAY_LOGO_URI = "data:image/jpeg;base64,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";

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
      <div className={`${base} overflow-hidden rounded-full bg-white border border-slate-100`} style={{ width: size, height: size }}>
        <img src={ALIPAY_LOGO_URI} alt="Alipay" className="h-full w-full object-cover" />
      </div>
    );
  }
  if (c === "wechat") {
    return (
      <div className={`${base} rounded-full`} style={{ width: size, height: size, background: "#07C160" }}>
        <svg viewBox="0 0 32 32" width={size * 0.66} height={size * 0.66}>
          <path
            d="M12.5 4.5C6.7 4.5 2 8.4 2 13.2c0 2.8 1.6 5.3 4.1 6.9l-.8 3 3.2-1.7c1.2.3 2.4.5 3.7.5.4 0 .8 0 1.2-.1a7.7 7.7 0 0 1-.3-2.2c0-5 4.9-9 10.9-9 .3 0 .6 0 1 .1C24.3 6.6 18.9 4.5 12.5 4.5Zm-3.2 4.8a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Zm6.4 0a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8Z"
            fill="#FFFFFF"
          />
          <path
            d="M30 20.8c0-3.7-3.9-6.7-8.7-6.7s-8.7 3-8.7 6.7 3.9 6.7 8.7 6.7c.9 0 1.9-.1 2.7-.4l2.6 1.4-.7-2.4c2-1.3 3.4-3.2 3.4-5.3Zm-11.8-1.2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm5.4 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </svg>
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
