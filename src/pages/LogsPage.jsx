import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

const ALL_EVENT_TYPES = [
  "login", "login_failed", "logout", "wallet_credit", "wallet_debit", "deposit_failed",
  "withdrawal_requested", "withdrawal_completed", "transfer", "security_setting_changed",
  "passcode_changed", "admin_action", "suspicious_activity", "kyc_status_changed",
  "admin_role_granted", "admin_role_changed", "admin_role_revoked", "sessions_revoked",
  "admin_sessions_revoked",
];

export default function LogsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  const load = useCallback(async () => {
    const { data } = await supabase.rpc("admin_list_security_events", {
      p_event_types: ALL_EVENT_TYPES,
      p_since: "30 days",
      p_limit: 500,
    });
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("logs-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "audit_log" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  const filtered = typeFilter === "all" ? rows : rows.filter((r) => r.event_type === typeFilter);
  const typesInData = Array.from(new Set(rows.map((r) => r.event_type))).sort();

  return (
    <div>
      <PageHeader title="Logs" subtitle={`${rows.length} events in the last 30 days`} />

      <div className="mb-5">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none">
          <option value="all">All event types</option>
          {typesInData.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No log events" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="text-[11.5px] text-slate-400">
                  <th className="pb-2.5 font-medium">Event</th>
                  <th className="pb-2.5 font-medium">User</th>
                  <th className="pb-2.5 font-medium">Description</th>
                  <th className="pb-2.5 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="py-2.5 text-[12.5px] capitalize text-slate-600">{e.event_type.replace(/_/g, " ")}</td>
                    <td className="py-2.5 text-[13px] text-slate-700">{e.user_name || "—"}</td>
                    <td className="py-2.5 text-[12.5px] text-slate-500">{e.description || "—"}</td>
                    <td className="py-2.5 text-right text-[12px] text-slate-400">{fmtDateTime(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
