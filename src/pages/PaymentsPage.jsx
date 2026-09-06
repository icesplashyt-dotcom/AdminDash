import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { Tag, StatusPill, fmtRmb, fmtFcfa, fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

const TYPE_FILTERS = ["all", "deposit", "withdrawal", "transfer_in", "transfer_out", "recharge"];
const STATUS_FILTERS = ["all", "completed", "pending", "processing", "verifying", "failed"];

export default function PaymentsPage({ onSettle }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("admin_v_recent_transactions").select("*").limit(200);
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("payments-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  const filtered = rows.filter(
    (r) => (typeFilter === "all" || r.type === typeFilter) && (statusFilter === "all" || r.status === statusFilter)
  );

  return (
    <div>
      <PageHeader title="Payments" subtitle={`${rows.length} transactions loaded`} />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none">
          {TYPE_FILTERS.map((t) => <option key={t} value={t}>{t === "all" ? "All types" : t.replace("_", " ")}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none">
          {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
        </select>
      </div>

      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No transactions match these filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="text-[11.5px] text-slate-400">
                  <th className="pb-2.5 font-medium">User</th>
                  <th className="pb-2.5 font-medium">Type</th>
                  <th className="pb-2.5 font-medium">Method</th>
                  <th className="pb-2.5 font-medium">Amount</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-3 text-[13px] text-slate-700">{t.user_name || "Unknown"}</td>
                    <td className="py-3 text-[13px] capitalize text-slate-600">{t.type.replace("_", " ")}</td>
                    <td className="py-3"><Tag code={t.provider} /></td>
                    <td className="py-3 text-[13px] font-medium text-slate-800">{fmtRmb(t.amount_rmb)}</td>
                    <td className="py-3"><StatusPill status={t.status} /></td>
                    <td className="py-3 text-right text-[12px] text-slate-400">{fmtDateTime(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">Transaction detail</h3>
            <div className="space-y-3 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>User</span><span className="font-medium text-slate-800">{selected.user_name}</span></div>
              <div className="flex justify-between"><span>Method</span><Tag code={selected.provider} /></div>
              <div className="flex justify-between"><span>Type</span><span className="capitalize">{selected.type.replace("_", " ")}</span></div>
              <div className="flex justify-between"><span>Amount</span><span className="font-medium text-slate-800">{fmtRmb(selected.amount_rmb)} ({fmtFcfa(selected.amount_fcfa)})</span></div>
              <div className="flex justify-between"><span>Status</span><StatusPill status={selected.status} /></div>
              <div className="flex justify-between"><span>Ref</span><span className="text-slate-400">{selected.transaction_ref}</span></div>
              <div className="flex justify-between"><span>Time</span><span className="text-slate-400">{fmtDateTime(selected.created_at)}</span></div>
            </div>
            {["pending", "processing", "verifying"].includes(selected.status) && ["deposit", "withdrawal"].includes(selected.type) && onSettle && (
              <div className="mt-5 flex gap-2">
                <button onClick={() => { onSettle(selected, "complete"); setSelected(null); }} className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-[13px] font-semibold text-emerald-600 hover:bg-emerald-100">Mark Completed</button>
                <button onClick={() => { onSettle(selected, "fail"); setSelected(null); }} className="flex-1 rounded-xl bg-rose-50 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-100">Mark Failed</button>
              </div>
            )}
            <button onClick={() => setSelected(null)} className="mt-2 w-full rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
