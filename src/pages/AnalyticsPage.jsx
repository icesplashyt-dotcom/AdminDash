import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line,
} from "recharts";
import { Tag, fmtRmb, fmtFcfa, SectionCard, SectionHeader, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

function fmtY(v) {
  if (v === 0) return "0";
  return `${(v / 1000000).toFixed(0)}M`;
}

export default function AnalyticsPage() {
  const [volume, setVolume] = useState([]);
  const [payments, setPayments] = useState([]);
  const [kyc, setKyc] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [volRes, payRes, kycRes, statsRes] = await Promise.all([
      supabase.from("admin_v_transaction_volume_daily").select("*"),
      supabase.from("admin_v_payments_overview").select("*"),
      supabase.from("admin_v_kyc_counts").select("*"),
      supabase.from("admin_v_dashboard_stats").select("*").maybeSingle(),
    ]);
    if (volRes.data) setVolume(volRes.data);
    if (payRes.data) setPayments(payRes.data);
    if (kycRes.data) {
      const counts = {};
      kycRes.data.forEach((r) => (counts[r.status] = r.count));
      setKyc(counts);
    }
    if (statsRes.data) setStats(statsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("analytics-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  const volumeData = volume.map((v) => ({ day: new Date(v.day).toLocaleDateString(undefined, { weekday: "short" }), volume: Number(v.volume_fcfa) }));
  const paymentsData = payments.map((p) => ({ provider: p.provider, amount: Number(p.total_amount_fcfa) }));

  if (loading) return <div><PageHeader title="Analytics" /><LoadingState /></div>;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Platform-wide trends" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-[11.5px] text-slate-500">Total Balance</div><div className="mt-1 text-[17px] font-bold text-slate-900">{stats ? fmtRmb(stats.total_balance_rmb) : "—"}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-[11.5px] text-slate-500">Total Users</div><div className="mt-1 text-[17px] font-bold text-slate-900">{stats?.total_users ?? "—"}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-[11.5px] text-slate-500">Total Transactions</div><div className="mt-1 text-[17px] font-bold text-slate-900">{stats?.total_transactions ?? "—"}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-[11.5px] text-slate-500">Today's Volume</div><div className="mt-1 text-[17px] font-bold text-slate-900">{stats ? fmtFcfa(stats.today_volume_fcfa) : "—"}</div></div>
      </div>

      <SectionCard className="mb-6">
        <SectionHeader title="Transaction Volume (7 days)" />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="volFillA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f1f4" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtY} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => fmtFcfa(v)} />
              <Area type="monotone" dataKey="volume" stroke="none" fill="url(#volFillA)" />
              <Line type="monotone" dataKey="volume" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard>
          <SectionHeader title="Volume by Payment Method" />
          {paymentsData.length === 0 ? <EmptyState label="No transaction data yet" /> : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentsData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f1f1f4" />
                  <XAxis dataKey="provider" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtY} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => fmtFcfa(v)} />
                  <Bar dataKey="amount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="KYC Funnel" />
          <div className="space-y-3">
            {["pending", "approved", "rejected"].map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span className="text-[13px] capitalize text-slate-600">{s}</span>
                <span className="text-[13px] font-semibold text-slate-800">{kyc[s] || 0}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
