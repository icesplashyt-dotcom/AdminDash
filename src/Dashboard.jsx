import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "./lib/supabaseClient";
import {
  Home, Users, CreditCard, Wallet, Layers, ShieldCheck, BarChart2,
  Repeat, Shield, Bell, Settings, UserCog, FileText, Search,
  ChevronDown, DollarSign, AlertTriangle, RefreshCw, Landmark,
  Smartphone, Check, Clock, X, ChevronRight, LogOut, User, Menu,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line,
} from "recharts";

const navItems = [
  { label: "Overview", icon: Home },
  { label: "Users", icon: Users },
  { label: "Payments", icon: CreditCard },
  { label: "Wallets", icon: Wallet },
  { label: "Cards", icon: Layers },
  { label: "KYC", icon: ShieldCheck },
  { label: "Analytics", icon: BarChart2 },
  { label: "Exchange", icon: Repeat },
  { label: "Security", icon: Shield },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
  { label: "Admin Roles", icon: UserCog },
  { label: "Logs", icon: FileText },
];

const providerMeta = {
  mtn: { bg: "bg-amber-100", fg: "text-amber-600", label: "MTN" },
  orange: { bg: "bg-orange-100", fg: "text-orange-600", label: "Orange" },
  alipay: { bg: "bg-blue-100", fg: "text-blue-600", label: "Alipay" },
  wechat: { bg: "bg-green-100", fg: "text-green-600", label: "WeChat" },
  bank: { bg: "bg-indigo-100", fg: "text-indigo-600", label: "Bank" },
  card: { bg: "bg-slate-200", fg: "text-slate-600", label: "Card" },
};

const channelIcon = {
  alipay: { icon: Smartphone, bg: "bg-blue-100", fg: "text-blue-600" },
  wechat: { icon: Smartphone, bg: "bg-green-100", fg: "text-green-600" },
  cash_rmb: { icon: DollarSign, bg: "bg-emerald-100", fg: "text-emerald-600" },
  bank_transfer: { icon: Landmark, bg: "bg-indigo-100", fg: "text-indigo-600" },
};

const serviceIcon = {
  mtn: { bg: "bg-amber-100", fg: "text-amber-600" },
  orange: { bg: "bg-orange-100", fg: "text-orange-600" },
  alipay: { bg: "bg-blue-100", fg: "text-blue-600" },
  wechat: { bg: "bg-green-100", fg: "text-green-600" },
};

const alertIcon = {
  login_failed: { icon: AlertTriangle, bg: "bg-rose-100", fg: "text-rose-500" },
  suspicious_activity: { icon: AlertTriangle, bg: "bg-orange-100", fg: "text-orange-500" },
  kyc_status_changed: { icon: ShieldCheck, bg: "bg-emerald-100", fg: "text-emerald-500" },
  security_setting_changed: { icon: Shield, bg: "bg-blue-100", fg: "text-blue-500" },
  admin_role_granted: { icon: UserCog, bg: "bg-violet-100", fg: "text-violet-500" },
  admin_role_changed: { icon: UserCog, bg: "bg-violet-100", fg: "text-violet-500" },
  admin_role_revoked: { icon: UserCog, bg: "bg-rose-100", fg: "text-rose-500" },
  sessions_revoked: { icon: Shield, bg: "bg-slate-200", fg: "text-slate-500" },
  admin_sessions_revoked: { icon: Shield, bg: "bg-slate-200", fg: "text-slate-500" },
};

function fmtFcfa(n) {
  const v = Number(n || 0);
  if (v >= 1000000) return `₣${(v / 1000000).toFixed(2)}M`;
  if (v >= 1000) return `₣${(v / 1000).toFixed(0)}K`;
  return `₣${v.toFixed(0)}`;
}
function fmtRmb(n) {
  return `¥${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
function fmtTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function pctChange(cur, prev) {
  const c = Number(cur || 0), p = Number(prev || 0);
  if (p === 0) return c > 0 ? 100 : 0;
  return ((c - p) / p) * 100;
}
function fmtY(v) {
  if (v === 0) return "0";
  return `${(v / 1000000).toFixed(0)}M`;
}

function Tag({ code }) {
  const m = providerMeta[code?.toLowerCase()] || { bg: "bg-slate-100", fg: "text-slate-600", label: code || "—" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${m.bg} ${m.fg}`}>
      {m.label}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    completed: "bg-emerald-100 text-emerald-600",
    pending: "bg-orange-100 text-orange-600",
    processing: "bg-blue-100 text-blue-600",
    verifying: "bg-blue-100 text-blue-600",
    failed: "bg-rose-100 text-rose-600",
  };
  return (
    <span className={`inline-block whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
function SectionHeader({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

export default function Dashboard({ adminEmail, adminRole, onSignOut }) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [ratesModalOpen, setRatesModalOpen] = useState(false);
  const [rateDrafts, setRateDrafts] = useState({});
  const [actionError, setActionError] = useState("");

  const [stats, setStats] = useState(null);
  const [volume, setVolume] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [kycCounts, setKycCounts] = useState({});
  const [kycRows, setKycRows] = useState([]);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [rates, setRates] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  const closeMenus = () => { setNotifOpen(false); setProfileOpen(false); };

  const loadAll = useCallback(async () => {
    const [
      statsRes, volRes, txRes, kycCountRes, kycRowsRes,
      svcRes, payRes, rateRes, alertRes, pendingRes,
    ] = await Promise.all([
      supabase.from("admin_v_dashboard_stats").select("*").maybeSingle(),
      supabase.from("admin_v_transaction_volume_daily").select("*"),
      supabase.from("admin_v_recent_transactions").select("*").limit(8),
      supabase.from("admin_v_kyc_counts").select("*"),
      supabase.from("kyc_submissions").select("id,user_id,doc_type,status,submitted_at,profiles:user_id(full_name,rmb_id)").order("submitted_at", { ascending: false }).limit(6),
      supabase.from("service_status").select("*"),
      supabase.from("admin_v_payments_overview").select("*"),
      supabase.from("exchange_rates").select("*"),
      supabase.from("admin_v_security_alerts").select("*").limit(6),
      supabase.from("admin_v_pending_settlements").select("*"),
    ]);

    if (statsRes.data) setStats(statsRes.data);
    if (volRes.data) setVolume(volRes.data);
    if (txRes.data) setRecentTx(txRes.data);
    if (kycCountRes.data) {
      const counts = {};
      kycCountRes.data.forEach((r) => (counts[r.status] = r.count));
      setKycCounts(counts);
    }
    if (kycRowsRes.data) setKycRows(kycRowsRes.data);
    if (svcRes.data) setServices(svcRes.data);
    if (payRes.data) setPayments(payRes.data);
    if (rateRes.data) {
      setRates(rateRes.data);
      const drafts = {};
      rateRes.data.forEach((r) => (drafts[r.channel] = r.rate_fcfa));
      setRateDrafts(drafts);
    }
    if (alertRes.data) setAlerts(alertRes.data);
    if (pendingRes.data) setPendingSettlements(pendingRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();

    const channel = supabase
      .channel("admin-dashboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "kyc_submissions" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_log" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "service_status" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "exchange_rates" }, loadAll)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [loadAll]);

  async function saveRates() {
    setActionError("");
    const updates = Object.entries(rateDrafts).map(([channel, rate_fcfa]) =>
      supabase.from("exchange_rates").update({ rate_fcfa: Number(rate_fcfa), updated_at: new Date().toISOString() }).eq("channel", channel)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed) {
      setActionError(failed.error.message);
    } else {
      setRatesModalOpen(false);
      loadAll();
    }
  }

  async function settleTx(tx, action) {
    setActionError("");
    let error;
    if (tx.type === "withdrawal") {
      if (action === "complete") {
        ({ error } = await supabase.rpc("admin_complete_withdrawal", { p_transaction_id: tx.id, p_provider_ref: `admin-manual-${Date.now()}` }));
      } else {
        ({ error } = await supabase.rpc("admin_fail_withdrawal", { p_transaction_id: tx.id, p_reason: "Rejected by admin" }));
      }
    } else if (tx.type === "deposit") {
      if (action === "complete") {
        ({ error } = await supabase.rpc("admin_complete_deposit", { p_transaction_id: tx.id, p_verified_amount_fcfa: tx.amount_fcfa, p_provider_ref: `admin-manual-${Date.now()}` }));
      } else {
        ({ error } = await supabase.rpc("admin_fail_deposit", { p_transaction_id: tx.id, p_reason: "Rejected by admin" }));
      }
    }
    if (error) {
      setActionError(error.message);
    } else {
      setSelectedTx(null);
      loadAll();
    }
  }

  async function setKycStatus(id, decision) {
    setActionError("");
    // admin_review_kyc validates the submission is still pending, updates
    // profiles.kyc_verified, writes the audit_log entry, and notifies the user.
    const { error } = await supabase.rpc("admin_review_kyc", {
      p_submission_id: id,
      p_decision: decision,
    });
    if (error) {
      setActionError(error.message);
    } else {
      setSelectedKyc(null);
      loadAll();
    }
  }

  const volumeChartData = volume.map((v) => ({
    day: new Date(v.day).toLocaleDateString(undefined, { weekday: "short" }),
    volume: Number(v.volume_fcfa),
  }));

  const todayChange = stats ? pctChange(stats.today_volume_fcfa, stats.yesterday_volume_fcfa) : 0;
  const failedChange = stats ? pctChange(stats.failed_today, stats.failed_yesterday) : 0;
  const userChangeLabel = stats ? `${stats.new_users_7d} new this week` : "";
  const txChangeLabel = stats ? `${stats.transactions_7d} this week` : "";

  const statCards = stats
    ? [
        { title: "Total Balance", value: fmtRmb(stats.total_balance_rmb), sub: "Across all wallets", subColor: "text-slate-400", icon: Wallet, iconBg: "bg-violet-600" },
        { title: "Total Users", value: stats.total_users, sub: userChangeLabel, subColor: "text-emerald-500", icon: Users, iconBg: "bg-blue-500" },
        { title: "Total Transactions", value: stats.total_transactions, sub: txChangeLabel, subColor: "text-emerald-500", icon: Repeat, iconBg: "bg-emerald-500" },
        { title: "Today's Volume", value: fmtFcfa(stats.today_volume_fcfa), sub: `${todayChange >= 0 ? "↑" : "↓"} ${Math.abs(todayChange).toFixed(1)}% vs yesterday`, subColor: todayChange >= 0 ? "text-emerald-500" : "text-rose-500", icon: DollarSign, iconBg: "bg-orange-500" },
        { title: "Failed Transactions", value: stats.failed_today, sub: `${failedChange >= 0 ? "↑" : "↓"} ${Math.abs(failedChange).toFixed(1)}% vs yesterday`, subColor: failedChange > 0 ? "text-rose-500" : "text-emerald-500", icon: AlertTriangle, iconBg: "bg-pink-500" },
      ]
    : [];

  return (
    <div className="flex h-full min-h-screen w-full bg-slate-50 text-slate-800" onClick={closeMenus}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }} />
      )}

      <aside
        className={`fixed z-40 flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-200 ease-out
        lg:static lg:z-auto lg:w-64 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-lg" style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}>¥</div>
            <span className="text-[19px] font-bold tracking-tight"><span className="text-slate-900">RMB</span><span className="text-violet-600">pay</span></span>
          </div>
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.label === activeNav;
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => { setActiveNav(item.label); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[13.5px] font-medium transition-colors ${active ? "bg-violet-50 text-violet-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
                <Icon size={17} className={active ? "text-violet-600" : "text-slate-400"} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-3.5 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-500 shrink-0"><User size={19} /></div>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1 text-[13.5px] font-semibold text-slate-800 truncate">
              {adminEmail?.split("@")[0] || "Admin"} <ShieldCheck size={13} className="text-violet-500 fill-violet-100 shrink-0" />
            </div>
            <div className="text-[12px] text-slate-400 capitalize">{adminRole}</div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 lg:px-8">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={(e) => { e.stopPropagation(); setSidebarOpen(true); }}><Menu size={20} /></button>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5 sm:max-w-xs lg:max-w-sm">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input placeholder="Search anything..." className="w-full min-w-0 bg-transparent text-[13.5px] outline-none placeholder:text-slate-400" />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }} className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
                <Bell size={19} />
                {alerts.length > 0 && <span className="absolute top-1 right-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{alerts.length}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                  <div className="mb-2 text-[13px] font-semibold text-slate-700">Notifications</div>
                  {alerts.slice(0, 4).map((a) => {
                    const m = alertIcon[a.event_type] || { icon: Shield, bg: "bg-slate-100", fg: "text-slate-500" };
                    return (
                      <div key={a.id} className="flex items-start gap-2 rounded-lg px-2 py-2 text-[12.5px] hover:bg-slate-50">
                        <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${m.bg} ${m.fg} shrink-0`}><m.icon size={12} /></span>
                        <div><div className="text-slate-700">{a.description || a.event_type}</div><div className="text-[11px] text-slate-400">{fmtTime(a.created_at)}</div></div>
                      </div>
                    );
                  })}
                  {alerts.length === 0 && <div className="px-2 py-3 text-[12.5px] text-slate-400">No alerts</div>}
                </div>
              )}
            </div>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }} className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-slate-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-500"><User size={16} /></div>
                <span className="hidden text-[13.5px] font-medium text-slate-700 sm:inline">{adminEmail?.split("@")[0]}</span>
                <ChevronDown size={14} className="hidden text-slate-400 sm:inline" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  <div className="px-2.5 py-2 text-[12px] text-slate-400 truncate">{adminEmail}</div>
                  <button onClick={onSignOut} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-rose-500 hover:bg-rose-50"><LogOut size={14} /> Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <h1 className="text-[20px] font-bold text-slate-900 sm:text-[22px]">Good morning, {adminEmail?.split("@")[0] || "Admin"} 👋</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12.5px] font-medium text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> System Online</span>
              <span className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[12.5px] font-medium text-violet-600"><Repeat size={13} /> Live data</span>
            </div>
          </div>

          {actionError && (
            <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-600">{actionError}</div>
          )}

          {loading ? (
            <div className="py-20 text-center text-[13.5px] text-slate-400">Loading dashboard…</div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                {statCards.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg} text-white`}><c.icon size={19} /></div>
                    <div className="text-[12.5px] text-slate-500">{c.title}</div>
                    <div className="mt-1 text-[20px] font-bold text-slate-900">{c.value}</div>
                    <div className={`mt-1.5 text-[12px] font-medium ${c.subColor}`}>{c.sub}</div>
                  </div>
                ))}
              </div>

              {pendingSettlements.length > 0 && (
                <SectionCard className="mb-6 border-orange-200">
                  <SectionHeader title={`Pending Settlements (${pendingSettlements.length})`} />
                  <div className="space-y-1">
                    {pendingSettlements.map((t) => (
                      <button key={t.id} onClick={() => setSelectedTx(t)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-slate-50">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-500 shrink-0"><Clock size={15} /></span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-slate-700">{t.user_name || "Unknown"} — <span className="capitalize">{t.type}</span></div>
                          <Tag code={t.provider} />
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[13px] font-semibold text-slate-700">{fmtRmb(t.amount_rmb)}</div>
                          <div className="text-[11px] text-slate-400">{fmtTime(t.created_at)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              )}

              <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
                <SectionCard className="xl:col-span-2">
                  <SectionHeader title="Transaction Volume (last 7 days)" />
                  <div className="h-60 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={volumeChartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f1f4" />
                        <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={fmtY} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v) => fmtFcfa(v)} />
                        <Area type="monotone" dataKey="volume" stroke="none" fill="url(#volFill)" />
                        <Line type="monotone" dataKey="volume" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader title="Live Transactions" />
                  <div className="space-y-1">
                    {recentTx.slice(0, 5).map((t) => (
                      <button key={t.id} onClick={() => setSelectedTx(t)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-slate-50">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-[11px] font-semibold text-white shrink-0">
                          {(t.user_name || "?").split(" ").map((s) => s[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-slate-700">{t.user_name || "Unknown"}</div>
                          <Tag code={t.provider} />
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-[13px] font-semibold text-slate-700">{fmtRmb(t.amount_rmb)}</div>
                          <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400">{fmtTime(t.created_at)} <span className={`h-1.5 w-1.5 rounded-full ${t.status === "completed" ? "bg-emerald-500" : t.status === "failed" ? "bg-rose-500" : "bg-orange-400"}`} /></div>
                        </div>
                      </button>
                    ))}
                    {recentTx.length === 0 && <div className="py-6 text-center text-[13px] text-slate-400">No transactions yet</div>}
                  </div>

                  <div className="mt-6 flex items-center justify-between"><h3 className="text-[14px] font-semibold text-slate-800">KYC Applications</h3></div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2.5 text-[13px] text-slate-600"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-500"><Clock size={12} /></span>Pending</div><span className="text-[13px] font-semibold text-slate-800">{kycCounts.pending || 0}</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2.5 text-[13px] text-slate-600"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-500"><Check size={12} /></span>Approved</div><span className="text-[13px] font-semibold text-slate-800">{kycCounts.approved || 0}</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2.5 text-[13px] text-slate-600"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-500"><X size={12} /></span>Rejected</div><span className="text-[13px] font-semibold text-slate-800">{kycCounts.rejected || 0}</span></div>
                  </div>

                  <div className="mt-6 flex items-center justify-between"><h3 className="text-[14px] font-semibold text-slate-800">System Status</h3></div>
                  <div className="mt-3 space-y-3">
                    {services.map((s) => {
                      const ic = serviceIcon[s.service] || { bg: "bg-slate-100", fg: "text-slate-500" };
                      return (
                        <div key={s.service} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 text-[13px] text-slate-600 capitalize"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${ic.bg} ${ic.fg}`}><Smartphone size={12} /></span>{s.service} Service</div>
                          <span className={`text-[12.5px] font-medium capitalize ${s.status === "operational" ? "text-emerald-500" : s.status === "degraded" ? "text-orange-500" : "text-rose-500"}`}>{s.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <SectionCard>
                  <SectionHeader title="Payments Overview" />
                  <div className="-mx-1 overflow-x-auto">
                    <table className="w-full min-w-[420px] text-left">
                      <thead><tr className="text-[11.5px] text-slate-400"><th className="px-1 pb-2.5 font-medium">Method</th><th className="px-1 pb-2.5 font-medium">Success</th><th className="px-1 pb-2.5 font-medium">Amount</th></tr></thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.provider} className="border-t border-slate-100">
                            <td className="px-1 py-3"><Tag code={p.provider} /></td>
                            <td className="px-1 py-3 text-[13px] text-slate-600">{p.success_rate ?? 0}%</td>
                            <td className="px-1 py-3 text-[13px] font-medium text-slate-800">{fmtRmb(p.total_amount_rmb)}</td>
                          </tr>
                        ))}
                        {payments.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-[13px] text-slate-400">No transactions yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader title="RMB Exchange Rates" action={<button onClick={() => setRatesModalOpen(true)} className="text-[12.5px] font-medium text-violet-600 hover:underline">Manage Rates</button>} />
                  <div className="-mx-1 overflow-x-auto">
                    <table className="w-full min-w-[380px] text-left">
                      <thead><tr className="text-[11.5px] text-slate-400"><th className="px-1 pb-2.5 font-medium">Channel</th><th className="px-1 pb-2.5 font-medium">Rate (1 RMB)</th><th className="px-1 pb-2.5 text-right font-medium">Last Updated</th></tr></thead>
                      <tbody>
                        {rates.map((r) => {
                          const ic = channelIcon[r.channel] || { icon: DollarSign, bg: "bg-slate-100", fg: "text-slate-500" };
                          return (
                            <tr key={r.channel} className="border-t border-slate-100">
                              <td className="px-1 py-3 text-[13px] text-slate-700 capitalize"><div className="flex items-center gap-2.5"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${ic.bg} ${ic.fg}`}><ic.icon size={12} /></span>{r.channel.replace("_", " ")}</div></td>
                              <td className="px-1 py-3 text-[13px] font-medium text-slate-800">{Number(r.rate_fcfa).toFixed(2)} FCFA</td>
                              <td className="px-1 py-3 text-right text-[12.5px] text-slate-400">{fmtTime(r.updated_at)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => setRatesModalOpen(true)} className="mt-4 w-full rounded-xl bg-violet-50 py-3 text-[13px] font-semibold text-violet-600 hover:bg-violet-100">Update Exchange Rates</button>
                </SectionCard>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <SectionCard>
                  <SectionHeader title="Recent KYC Submissions" />
                  <div className="space-y-1">
                    {kycRows.map((k) => (
                      <button key={k.id} onClick={() => setSelectedKyc(k)} className="flex w-full items-center justify-between rounded-xl px-2 py-2.5 text-left hover:bg-slate-50">
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-slate-700">{k.profiles?.full_name || "Unknown"}</div>
                          <div className="text-[11.5px] text-slate-400">{k.doc_type} · {k.profiles?.rmb_id}</div>
                        </div>
                        <StatusPill status={k.status === "approved" ? "completed" : k.status === "rejected" ? "failed" : "pending"} />
                      </button>
                    ))}
                    {kycRows.length === 0 && <div className="py-6 text-center text-[13px] text-slate-400">No KYC submissions yet</div>}
                  </div>
                </SectionCard>

                <SectionCard>
                  <SectionHeader title="Security Alerts" />
                  <div className="space-y-1">
                    {alerts.map((a) => {
                      const m = alertIcon[a.event_type] || { icon: Shield, bg: "bg-slate-100", fg: "text-slate-500" };
                      return (
                        <div key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-slate-50">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${m.bg} ${m.fg} shrink-0`}><m.icon size={15} /></span>
                          <span className="flex-1 text-[13px] text-slate-700">{a.description || a.event_type} {a.user_name ? `— ${a.user_name}` : ""}</span>
                          <span className="shrink-0 text-[12px] text-slate-400">{fmtTime(a.created_at)}</span>
                        </div>
                      );
                    })}
                    {alerts.length === 0 && <div className="py-6 text-center text-[13px] text-slate-400">No security events</div>}
                  </div>
                </SectionCard>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4" onClick={() => setSelectedTx(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Transaction detail</h3>
            <div className="space-y-3 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>User</span><span className="font-medium text-slate-800">{selectedTx.user_name}</span></div>
              <div className="flex justify-between"><span>Method</span><Tag code={selectedTx.provider} /></div>
              <div className="flex justify-between"><span>Type</span><span className="capitalize">{selectedTx.type}</span></div>
              <div className="flex justify-between"><span>Amount</span><span className="font-medium text-slate-800">{fmtRmb(selectedTx.amount_rmb)} ({fmtFcfa(selectedTx.amount_fcfa)})</span></div>
              <div className="flex justify-between"><span>Status</span><StatusPill status={selectedTx.status} /></div>
              <div className="flex justify-between"><span>Ref</span><span className="text-slate-400">{selectedTx.transaction_ref}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="text-slate-400">{new Date(selectedTx.created_at).toLocaleString()}</span></div>
            </div>
            {["pending", "processing", "verifying"].includes(selectedTx.status) && ["deposit", "withdrawal"].includes(selectedTx.type) && (
              <div className="mt-5 flex gap-2">
                <button onClick={() => settleTx(selectedTx, "complete")} className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-[13px] font-semibold text-emerald-600 hover:bg-emerald-100">Mark Completed</button>
                <button onClick={() => settleTx(selectedTx, "fail")} className="flex-1 rounded-xl bg-rose-50 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-100">Mark Failed</button>
              </div>
            )}
            <button onClick={() => setSelectedTx(null)} className="mt-2 w-full rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Close</button>
          </div>
        </div>
      )}

      {selectedKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4" onClick={() => setSelectedKyc(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">KYC submission</h3>
            <div className="space-y-3 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>User</span><span className="font-medium text-slate-800">{selectedKyc.profiles?.full_name}</span></div>
              <div className="flex justify-between"><span>RMB ID</span><span className="text-slate-400">{selectedKyc.profiles?.rmb_id}</span></div>
              <div className="flex justify-between"><span>Document</span><span className="capitalize">{selectedKyc.doc_type.replace("_", " ")}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="capitalize font-medium text-slate-800">{selectedKyc.status}</span></div>
              <div className="flex justify-between"><span>Submitted</span><span className="text-slate-400">{new Date(selectedKyc.submitted_at).toLocaleString()}</span></div>
            </div>
            {selectedKyc.status === "pending" && (
              <div className="mt-5 flex gap-2">
                <button onClick={() => setKycStatus(selectedKyc.id, "approved")} className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-[13px] font-semibold text-emerald-600 hover:bg-emerald-100">Approve</button>
                <button onClick={() => setKycStatus(selectedKyc.id, "rejected")} className="flex-1 rounded-xl bg-rose-50 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-100">Reject</button>
              </div>
            )}
            <button onClick={() => setSelectedKyc(null)} className="mt-2 w-full rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Close</button>
          </div>
        </div>
      )}

      {ratesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4" onClick={() => setRatesModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Update exchange rates</h3>
            <div className="space-y-3">
              {rates.map((r) => (
                <div key={r.channel} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-slate-600 capitalize">{r.channel.replace("_", " ")}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={rateDrafts[r.channel] ?? ""}
                    onChange={(e) => setRateDrafts((d) => ({ ...d, [r.channel]: e.target.value }))}
                    className="w-28 rounded-lg border border-slate-200 px-2.5 py-1.5 text-right text-[13px] outline-none focus:border-violet-400"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={saveRates} className="flex-1 rounded-xl bg-violet-600 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-700">Save</button>
              <button onClick={() => setRatesModalOpen(false)} className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
