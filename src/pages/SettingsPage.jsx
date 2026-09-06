import React from "react";
import { LogOut, ShieldCheck, Mail } from "lucide-react";
import { SectionCard, PageHeader } from "../lib/adminUi";

export default function SettingsPage({ adminEmail, adminRole, onSignOut }) {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Your admin account" />
      <SectionCard className="max-w-md">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-500"><ShieldCheck size={20} /></div>
          <div>
            <div className="text-[14px] font-semibold text-slate-800 capitalize">{adminRole}</div>
            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500"><Mail size={12} /> {adminEmail}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 text-[13px] font-semibold text-rose-600 hover:bg-rose-100"
        >
          <LogOut size={14} /> Sign out
        </button>
      </SectionCard>
    </div>
  );
}
