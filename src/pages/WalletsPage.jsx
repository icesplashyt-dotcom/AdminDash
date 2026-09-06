import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { fmtRmb, fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

export default function WalletsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("wallets")
        .select("id, balance_rmb, updated_at, profiles:user_id(full_name, rmb_id)")
        .order("balance_rmb", { ascending: false });
      if (!cancelled) {
        setRows(data || []);
        setLoading(false);
      }
    }
    load();
    const channel = supabase
      .channel("wallets-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, load)
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, []);

  const total = rows.reduce((sum, r) => sum + Number(r.balance_rmb || 0), 0);

  return (
    <div>
      <PageHeader title="Wallets" subtitle={`${rows.length} wallets · ${fmtRmb(total)} total balance`} />
      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState label="No wallets found" />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2.5 font-medium">User</th>
                <th className="pb-2.5 font-medium">RMB ID</th>
                <th className="pb-2.5 font-medium">Balance</th>
                <th className="pb-2.5 font-medium text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.id} className="border-t border-slate-100">
                  <td className="py-3 text-[13px] text-slate-700">{w.profiles?.full_name || "Unknown"}</td>
                  <td className="py-3 text-[12.5px] text-slate-500">{w.profiles?.rmb_id}</td>
                  <td className="py-3 text-[13px] font-medium text-slate-800">{fmtRmb(w.balance_rmb)}</td>
                  <td className="py-3 text-right text-[12px] text-slate-400">{fmtDateTime(w.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}
