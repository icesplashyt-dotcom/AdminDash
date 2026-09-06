import React, { useEffect, useState, useCallback } from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

export default function NotificationsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, message, is_read, created_at, profiles:user_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("notifications-page-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${rows.length} sent across all users`} />
      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState label="No notifications yet" />
        ) : (
          <div className="space-y-1">
            {rows.map((n) => {
              const isFraud = n.type === "fraud";
              return (
                <div key={n.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50">
                  <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${isFraud ? "bg-rose-100 text-rose-500" : "bg-violet-100 text-violet-500"}`}>
                    {isFraud ? <ShieldAlert size={14} /> : <Bell size={14} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-slate-700">{n.title} <span className="font-normal text-slate-400">— {n.profiles?.full_name || "Unknown"}</span></div>
                    <div className="text-[12px] text-slate-500">{n.message}</div>
                    <div className="text-[11px] text-slate-400">{fmtDateTime(n.created_at)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
