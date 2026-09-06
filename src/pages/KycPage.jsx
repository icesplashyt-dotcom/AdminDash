import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { StatusPill, fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState, Avatar } from "../lib/adminUi";

const FILTERS = ["pending", "approved", "rejected", "all"];

export default function KycPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("kyc_submissions")
      .select("id, user_id, doc_type, status, submitted_at, reviewed_at, profiles:user_id(full_name, rmb_id, avatar_url)")
      .order("submitted_at", { ascending: false })
      .limit(200);
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("kyc-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "kyc_submissions" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  async function setStatus(id, decision) {
    setActionError("");
    const { error } = await supabase.rpc("admin_review_kyc", { p_submission_id: id, p_decision: decision });
    if (error) setActionError(error.message);
    else { setSelected(null); load(); }
  }

  return (
    <div>
      <PageHeader title="KYC Verification" subtitle={`${rows.filter((r) => r.status === "pending").length} pending review`} />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium capitalize ${filter === f ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {actionError && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-600">{actionError}</div>}

      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="Nothing here" />
        ) : (
          <div className="space-y-1">
            {filtered.map((k) => (
              <button key={k.id} onClick={() => setSelected(k)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-50">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar url={k.profiles?.avatar_url} name={k.profiles?.full_name} size={32} />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-slate-700">{k.profiles?.full_name || "Unknown"}</div>
                    <div className="text-[11.5px] text-slate-400 capitalize">{k.doc_type.replace("_", " ")} · {k.profiles?.rmb_id} · {fmtDateTime(k.submitted_at)}</div>
                  </div>
                </div>
                <StatusPill status={k.status === "approved" ? "completed" : k.status === "rejected" ? "failed" : "pending"} />
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-[15px] font-semibold text-slate-800">KYC submission</h3>
            <div className="mb-4 flex items-center gap-3">
              <Avatar url={selected.profiles?.avatar_url} name={selected.profiles?.full_name} size={36} />
              <span className="text-[14px] font-medium text-slate-800">{selected.profiles?.full_name}</span>
            </div>
            <div className="space-y-3 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>RMB ID</span><span className="text-slate-400">{selected.profiles?.rmb_id}</span></div>
              <div className="flex justify-between"><span>Document</span><span className="capitalize">{selected.doc_type.replace("_", " ")}</span></div>
              <div className="flex justify-between"><span>Status</span><span className="capitalize font-medium text-slate-800">{selected.status}</span></div>
              <div className="flex justify-between"><span>Submitted</span><span className="text-slate-400">{fmtDateTime(selected.submitted_at)}</span></div>
              {selected.reviewed_at && <div className="flex justify-between"><span>Reviewed</span><span className="text-slate-400">{fmtDateTime(selected.reviewed_at)}</span></div>}
            </div>
            {selected.status === "pending" && (
              <div className="mt-5 flex gap-2">
                <button onClick={() => setStatus(selected.id, "approved")} className="flex-1 rounded-xl bg-emerald-50 py-2.5 text-[13px] font-semibold text-emerald-600 hover:bg-emerald-100">Approve</button>
                <button onClick={() => setStatus(selected.id, "rejected")} className="flex-1 rounded-xl bg-rose-50 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-100">Reject</button>
              </div>
            )}
            <button onClick={() => setSelected(null)} className="mt-2 w-full rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
