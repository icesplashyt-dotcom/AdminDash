import React from "react";
import { Smartphone, DollarSign, Landmark } from "lucide-react";

export const providerMeta = {
  mtn: { bg: "bg-amber-100", fg: "text-amber-600", label: "MTN" },
  orange: { bg: "bg-orange-100", fg: "text-orange-600", label: "Orange" },
  alipay: { bg: "bg-blue-100", fg: "text-blue-600", label: "Alipay" },
  wechat: { bg: "bg-green-100", fg: "text-green-600", label: "WeChat" },
  bank: { bg: "bg-indigo-100", fg: "text-indigo-600", label: "Bank" },
  card: { bg: "bg-slate-200", fg: "text-slate-600", label: "Card" },
};

export const channelIcon = {
  alipay: { icon: Smartphone, bg: "bg-blue-100", fg: "text-blue-600" },
  wechat: { icon: Smartphone, bg: "bg-green-100", fg: "text-green-600" },
  cash_rmb: { icon: DollarSign, bg: "bg-emerald-100", fg: "text-emerald-600" },
  bank_transfer: { icon: Landmark, bg: "bg-indigo-100", fg: "text-indigo-600" },
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

export function Tag({ code }) {
  const m = providerMeta[(code || "").toLowerCase()] || { bg: "bg-slate-100", fg: "text-slate-600", label: code || "—" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${m.bg} ${m.fg}`}>
      {m.label}
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
