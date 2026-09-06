import React, { useEffect, useState, useCallback } from "react";
import { Ban, ShieldCheck, LogOut, Search } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { fmtRmb, fmtDateTime, SectionCard, PageHeader, EmptyState, LoadingState, Avatar } from "../lib/adminUi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setActionError("");
    const { data, error } = await supabase.rpc("admin_list_users");
    if (error) setActionError(error.message);
    else setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? users.filter((u) =>
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.rmb_id || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q)
      )
    : users;

  async function toggleBan(user) {
    setBusy(true);
    setActionError("");
    const { error } = await supabase.rpc("admin_set_user_ban", { p_user_id: user.id, p_banned: !user.is_banned });
    if (error) setActionError(error.message);
    else await load();
    setBusy(false);
  }

  async function revokeSessions(user) {
    setBusy(true);
    setActionError("");
    const { error } = await supabase.rpc("admin_revoke_user_sessions", { p_user_id: user.id });
    if (error) setActionError(error.message);
    else setActionError("");
    setBusy(false);
  }

  return (
    <div>
      <PageHeader title="Users" subtitle={`${users.length} total accounts`} />

      <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 sm:max-w-sm">
        <Search size={16} className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, RMB ID, phone…"
          className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-slate-400"
        />
      </div>

      {actionError && <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2.5 text-[13px] text-rose-600">{actionError}</div>}

      <SectionCard>
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState label="No users match your search" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="text-[11.5px] text-slate-400">
                  <th className="pb-2.5 font-medium">User</th>
                  <th className="pb-2.5 font-medium">RMB ID</th>
                  <th className="pb-2.5 font-medium">Balance</th>
                  <th className="pb-2.5 font-medium">KYC</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium">Joined</th>
                  <th className="pb-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar url={u.avatar_url} name={u.full_name} size={32} />
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-slate-800">{u.full_name || "—"}</div>
                          <div className="truncate text-[11.5px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[12.5px] text-slate-500">{u.rmb_id}</td>
                    <td className="py-3 text-[13px] font-medium text-slate-800">{fmtRmb(u.balance_rmb)}</td>
                    <td className="py-3">
                      {u.kyc_verified ? (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600"><ShieldCheck size={13} /> Verified</span>
                      ) : (
                        <span className="text-[12px] text-slate-400">Unverified</span>
                      )}
                    </td>
                    <td className="py-3">
                      {u.is_banned ? (
                        <span className="rounded-md bg-rose-100 px-2 py-1 text-[11.5px] font-semibold text-rose-600">Banned</span>
                      ) : (
                        <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11.5px] font-semibold text-emerald-600">Active</span>
                      )}
                    </td>
                    <td className="py-3 text-[12px] text-slate-400">{fmtDateTime(u.created_at)}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => setSelected(u)} className="text-[12.5px] font-medium text-violet-600 hover:underline">Manage</button>
                    </td>
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
            <div className="mb-1 flex items-center gap-3">
              <Avatar url={selected.avatar_url} name={selected.full_name} size={40} />
              <h3 className="text-[15px] font-semibold text-slate-800">{selected.full_name}</h3>
            </div>
            <p className="mb-4 text-[12.5px] text-slate-400">{selected.email} · {selected.rmb_id}</p>
            <div className="space-y-2.5 text-[13px] text-slate-600">
              <div className="flex justify-between"><span>Balance</span><span className="font-medium text-slate-800">{fmtRmb(selected.balance_rmb)}</span></div>
              <div className="flex justify-between"><span>Phone</span><span>{selected.phone}</span></div>
              <div className="flex justify-between"><span>Account type</span><span className="capitalize">{selected.account_type}</span></div>
              <div className="flex justify-between"><span>Joined</span><span>{fmtDateTime(selected.created_at)}</span></div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <button
                disabled={busy}
                onClick={() => toggleBan(selected)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold disabled:opacity-60 ${selected.is_banned ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}
              >
                <Ban size={14} /> {selected.is_banned ? "Unban User" : "Ban User"}
              </button>
              <button
                disabled={busy}
                onClick={() => revokeSessions(selected)}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-60"
              >
                <LogOut size={14} /> Revoke All Sessions
              </button>
            </div>
            <button onClick={() => setSelected(null)} className="mt-2 w-full rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
