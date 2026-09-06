import React, { useEffect, useState, useCallback } from "react";
import { UserCog } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState } from "../lib/adminUi";

const roleBadge = {
  superadmin: "bg-violet-100 text-violet-600",
  finance: "bg-blue-100 text-blue-600",
  support: "bg-slate-100 text-slate-600",
};

export default function AdminRolesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("admin_list_admins");
    if (error) setActionError(error.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader title="Admin Roles" subtitle={`${rows.length} admin accounts`} />
      {actionError && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-600">{actionError}</div>}
      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState label="No admin accounts found" />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11.5px] text-slate-400">
                <th className="pb-2.5 font-medium">Admin</th>
                <th className="pb-2.5 font-medium">Role</th>
                <th className="pb-2.5 font-medium text-right">Granted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.user_id} className="border-t border-slate-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-500 shrink-0"><UserCog size={14} /></div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-slate-800">{a.full_name || "—"}</div>
                        <div className="truncate text-[11.5px] text-slate-400">{a.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`rounded-md px-2 py-1 text-[11.5px] font-semibold capitalize ${roleBadge[a.role] || "bg-slate-100 text-slate-600"}`}>{a.role}</span>
                  </td>
                  <td className="py-3 text-right text-[12px] text-slate-400">{fmtDateTime(a.granted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}
