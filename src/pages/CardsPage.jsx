import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

export default function CardsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cards")
      .select("id, brand, holder, number_last4, expiry, created_at, profiles:user_id(full_name, rmb_id)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setRows(data || []); setLoading(false); });
  }, []);

  return (
    <div>
      <PageHeader title="Cards" subtitle={`${rows.length} saved cards across all users`} />
      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState label="No cards on file" />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2.5 font-medium">User</th>
                <th className="pb-2.5 font-medium">Card</th>
                <th className="pb-2.5 font-medium">Holder</th>
                <th className="pb-2.5 font-medium">Expiry</th>
                <th className="pb-2.5 font-medium text-right">Added</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="py-3 text-[13px] text-slate-700">{c.profiles?.full_name || "Unknown"}</td>
                  <td className="py-3 text-[13px] text-slate-600"><span className="inline-flex items-center gap-1.5 capitalize"><CreditCard size={13} className="text-slate-400" /> {c.brand} •••• {c.number_last4}</span></td>
                  <td className="py-3 text-[12.5px] text-slate-500">{c.holder}</td>
                  <td className="py-3 text-[12.5px] text-slate-500">{c.expiry}</td>
                  <td className="py-3 text-right text-[12px] text-slate-400">{fmtDateTime(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}
