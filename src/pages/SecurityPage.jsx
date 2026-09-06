import React, { useEffect, useState, useCallback } from "react";
import { Shield, AlertTriangle, ShieldCheck, UserCog } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { fmtDateTime, SectionCard, SectionHeader, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

const alertIcon = {
  login_failed: { icon: AlertTriangle, bg: "bg-rose-100", fg: "text-rose-500" },
  suspicious_activity: { icon: AlertTriangle, bg: "bg-orange-100", fg: "text-orange-500" },
  kyc_status_changed: { icon: ShieldCheck, bg: "bg-emerald-100", fg: "text-emerald-500" },
  security_setting_changed: { icon: Shield, bg: "bg-blue-100", fg: "text-blue-500" },
  admin_role_granted: { icon: UserCog, bg: "bg-violet-100", fg: "text-violet-500" },
  admin_role_changed: { icon: UserCog, bg: "bg-violet-100", fg: "text-violet-500" },
  admin_role_revoked: { icon: UserCog, bg: "bg-rose-100", fg: "text-rose-500" },
};

const SECURITY_EVENT_TYPES = [
  "login_failed", "suspicious_activity", "security_setting_changed", "passcode_changed",
  "kyc_status_changed", "admin_role_granted", "admin_role_changed", "admin_role_revoked",
  "sessions_revoked", "admin_sessions_revoked",
];

export default function SecurityPage() {
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [lockouts, setLockouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [summaryRes, eventsRes, lockoutRes] = await Promise.all([
      supabase.rpc("admin_security_summary"),
      supabase.rpc("admin_list_security_events", { p_event_types: SECURITY_EVENT_TYPES, p_since: "7 days", p_limit: 100 }),
      supabase.rpc("admin_list_lockouts"),
    ]);
    if (summaryRes.data) setSummary(Array.isArray(summaryRes.data) ? summaryRes.data[0] : summaryRes.data);
    if (eventsRes.data) setEvents(eventsRes.data);
    if (lockoutRes.data) setLockouts(lockoutRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("security-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_log" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "login_lockouts" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  return (
    <div>
      <PageHeader title="Security" subtitle="Recent security events across all accounts" />

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-[11.5px] capitalize text-slate-500">{key.replace(/_/g, " ")}</div>
              <div className="mt-1 text-[18px] font-bold text-slate-900">{String(value)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard>
          <SectionHeader title="Recent Events" />
          {loading ? <LoadingState /> : events.length === 0 ? <EmptyState label="No recent security events" /> : (
            <div className="space-y-1">
              {events.map((e) => {
                const m = alertIcon[e.event_type] || { icon: Shield, bg: "bg-slate-100", fg: "text-slate-500" };
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${m.bg} ${m.fg} shrink-0`}><m.icon size={14} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] text-slate-700">{e.description || e.event_type}</div>
                      <div className="text-[11px] text-slate-400">{fmtDateTime(e.created_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Login Lockouts" />
          {loading ? <LoadingState /> : lockouts.length === 0 ? <EmptyState label="No active lockouts" /> : (
            <table className="w-full text-left">
              <thead><tr className="text-[11.5px] text-slate-400"><th className="pb-2 font-medium">User</th><th className="pb-2 font-medium">Attempts</th><th className="pb-2 font-medium">Locked Until</th><th className="pb-2 font-medium text-right">Updated</th></tr></thead>
              <tbody>
                {lockouts.map((l) => (
                  <tr key={l.user_id} className="border-t border-slate-100">
                    <td className="py-2.5 text-[13px] text-slate-700">{l.full_name || l.email || l.user_id}</td>
                    <td className="py-2.5 text-[13px] text-slate-600">{l.failed_count}</td>
                    <td className="py-2.5 text-[12.5px] text-slate-500">{l.locked_until ? fmtDateTime(l.locked_until) : "—"}</td>
                    <td className="py-2.5 text-right text-[12px] text-slate-400">{fmtDateTime(l.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
