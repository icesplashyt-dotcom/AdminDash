import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { BrandIcon, fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

export default function ExchangePage() {
  const [rates, setRates] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("exchange_rates").select("*").order("channel");
    setRates(data || []);
    const d = {};
    (data || []).forEach((r) => (d[r.channel] = r.rate_fcfa));
    setDrafts(d);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("exchange-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "exchange_rates" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  async function saveAll() {
    setSaving(true);
    setActionError("");
    setSavedMsg("");
    const updates = Object.entries(drafts).map(([channel, rate_fcfa]) =>
      supabase.from("exchange_rates").update({ rate_fcfa: Number(rate_fcfa), updated_at: new Date().toISOString() }).eq("channel", channel)
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    setSaving(false);
    if (failed) setActionError(failed.error.message);
    else { setSavedMsg("Rates updated"); load(); }
  }

  return (
    <div>
      <PageHeader title="Exchange Rates" subtitle="RMB to FCFA rates by channel" />

      {actionError && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-600">{actionError}</div>}
      {savedMsg && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-600">{savedMsg}</div>}

      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : rates.length === 0 ? (
          <EmptyState label="No exchange rate channels configured" />
        ) : (
          <div className="space-y-3">
            {rates.map((r) => (
              <div key={r.channel} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <BrandIcon code={r.channel} size={28} />
                  <div>
                    <div className="text-[13px] font-medium capitalize text-slate-800">{r.channel.replace("_", " ")}</div>
                    <div className="text-[11.5px] text-slate-400">Updated {fmtDateTime(r.updated_at)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={drafts[r.channel] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.channel]: e.target.value }))}
                    className="w-28 rounded-lg border border-slate-200 px-2.5 py-1.5 text-right text-[13px] outline-none focus:border-violet-400"
                  />
                  <span className="text-[12px] text-slate-400">FCFA</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={saveAll} disabled={saving || loading} className="mt-5 w-full rounded-xl bg-violet-600 py-2.5 text-[13px] font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
          {saving ? "Saving…" : "Save All Rates"}
        </button>
      </SectionCard>
    </div>
  );
}
