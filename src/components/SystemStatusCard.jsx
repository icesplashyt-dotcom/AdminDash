import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { BrandIcon, SectionCard, SectionHeader } from "../lib/adminUi";

export default function SystemStatusCard({ adminRole }) {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("service_status").select("*").order("service");
    setServices(data || []);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("system-status-card-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "service_status" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [load]);

  async function setStatus(service, status) {
    setActionError("");
    const { error } = await supabase
      .from("service_status")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("service", service);
    if (error) setActionError(error.message);
    else { setSelected(null); load(); }
  }

  return (
    <>
      <SectionCard className="mb-6">
        <SectionHeader title="System Status" />
        {actionError && <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-600">{actionError}</div>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {services.map((s) => (
            <button
              key={s.service}
              onClick={() => setSelected(s)}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-left hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 text-[13px] capitalize text-slate-600"><BrandIcon code={s.service} size={22} />{s.service}</div>
              <span className={`text-[11.5px] font-semibold capitalize ${s.status === "operational" ? "text-emerald-500" : s.status === "degraded" ? "text-orange-500" : s.status === "maintenance" ? "text-blue-500" : "text-rose-500"}`}>{s.status}</span>
            </button>
          ))}
          {services.length === 0 && <div className="col-span-full py-2 text-[13px] text-slate-400">No services configured</div>}
        </div>
      </SectionCard>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <BrandIcon code={selected.service} size={30} />
              <h3 className="text-[15px] font-semibold capitalize text-slate-800">{selected.service} Service</h3>
            </div>
            <p className="mb-4 text-[12.5px] text-slate-500">
              Current status: <span className="font-medium capitalize text-slate-800">{selected.status}</span>
            </p>
            {adminRole !== "superadmin" ? (
              <p className="rounded-xl bg-orange-50 px-3 py-2.5 text-[12.5px] text-orange-600">Only superadmins can change service status.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "operational", label: "Operational", cls: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
                  { value: "degraded", label: "Degraded", cls: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
                  { value: "maintenance", label: "Maintenance", cls: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
                  { value: "down", label: "Down", cls: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    disabled={selected.status === opt.value}
                    onClick={() => setStatus(selected.service, opt.value)}
                    className={`rounded-xl py-2.5 text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${opt.cls}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setSelected(null)} className="mt-3 w-full rounded-xl py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
