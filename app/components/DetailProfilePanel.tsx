"use client";

import { useState } from "react";
import {
  X, Phone, Mail, Building2, User, FileText, FileSpreadsheet,
  CheckSquare, Square, Clock, PhoneCall, MessageSquare,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import { exportCallToPDF, exportSingleCallToCSV } from "@/lib/exportUtils";

interface Props { call: Call; onClose: () => void; }

const avatarPalette = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F43F5E",
  "#F59E0B", "#06B6D4", "#6366F1", "#EC4899", "#14B8A6", "#F97316",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarPalette[Math.abs(h) % avatarPalette.length];
}

const statusMap: Record<string, { label: string; cls: string }> = {
  erfolgreich: { label: "Active", cls: "bg-emerald-100 text-emerald-700" },
  nicht_erfolgreich: { label: "Needs follow-up", cls: "bg-red-100 text-red-700" },
  weitergeleitet: { label: "Escalated", cls: "bg-amber-100 text-amber-700" },
};

export default function DetailProfilePanel({ call, onClose }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => setChecked((prev) => {
    const next = new Set(prev);
    if (next.has(i)) {
      next.delete(i);
    } else {
      next.add(i);
    }
    return next;
  });

  const status = statusMap[call.status] || statusMap.erfolgreich;
  const done = checked.size;
  const total = call.summaryBullets.length;

  return (
    <div className="w-[355px] min-w-[320px] h-full flex flex-col bg-white border-l border-[#E6EAF3] shrink-0">
      <div className="h-[74px] px-5 flex items-center justify-between border-b border-[#E6EAF3] shrink-0">
        <h3 className="text-[16px] font-semibold text-slate-900">Profile & Activity</h3>
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors text-slate-500 flex items-center justify-center">
          <X size={17} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFBFF]">
        <div className="rounded-3xl bg-white border border-[#E6EAF3] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-[16px] font-bold" style={{ backgroundColor: avatarColor(call.customerName) }}>
              {getInitials(call.customerName)}
            </div>
            <div className="min-w-0">
              <h4 className="text-[16px] font-semibold text-slate-900 truncate">{call.customerName}</h4>
              <p className="text-[12px] text-slate-500 truncate">{call.customerEmail}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="h-10 rounded-xl border border-[#E6EAF3] flex items-center justify-center text-slate-500 hover:border-indigo-200 hover:text-indigo-600"><MessageSquare size={15} /></button>
            <button className="h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600"><Phone size={15} /></button>
            <button className="h-10 rounded-xl border border-[#E6EAF3] flex items-center justify-center text-slate-500 hover:border-indigo-200 hover:text-indigo-600"><Mail size={15} /></button>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#E6EAF3] p-4 space-y-3">
          <h5 className="text-[12px] uppercase tracking-[0.16em] text-slate-500">Overview</h5>
          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between"><span className="text-slate-500">Status</span><span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full", status.cls)}>{status.label}</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Appeals</span><span className="text-slate-900">2</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Last Contact</span><span className="text-slate-900">1h ago</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Subscribed</span><span className="text-slate-900">9 days ago</span></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">Assigned</span><span className="text-slate-900">{call.employeeAssigned}</span></div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#E6EAF3] p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><PhoneCall size={15} className="text-indigo-600" /></div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate">{call.subject}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2"><Clock size={11} />{formatDuration(call.duration)} · {formatTimestamp(call.timestamp)}</p>
            </div>
          </div>
          <p className="text-[13px] text-slate-600 leading-relaxed">{call.summary}</p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E6EAF3] p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-[13px] font-semibold text-slate-900">Action Checklist</h5>
            <span className="text-[12px] text-slate-500">{done}/{total}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }} />
          </div>
          <div className="space-y-1">
            {call.summaryBullets.map((b, i) => {
              const isChecked = checked.has(i);
              return (
                <button key={i} onClick={() => toggle(i)} className="w-full flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left">
                  {isChecked ? <CheckSquare size={15} className="text-indigo-500 shrink-0 mt-0.5" /> : <Square size={15} className="text-slate-300 shrink-0 mt-0.5" />}
                  <span className={cn("text-[13px] leading-snug", isChecked ? "line-through text-slate-400" : "text-slate-700")}>{b}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-[#E6EAF3] p-4 space-y-3">
          <h5 className="text-[13px] font-semibold text-slate-900">Contact</h5>
          <div className="space-y-2.5 text-[13px] text-slate-700">
            <div className="flex items-center gap-2.5"><Phone size={14} className="text-indigo-500" />{call.customerPhone}</div>
            <div className="flex items-center gap-2.5"><Mail size={14} className="text-indigo-500" />{call.customerEmail}</div>
            {call.customerRole && <div className="flex items-center gap-2.5"><User size={14} className="text-indigo-500" />{call.customerRole}</div>}
            {call.customerCompany && <div className="flex items-center gap-2.5"><Building2 size={14} className="text-indigo-500" />{call.customerCompany}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => exportCallToPDF(call)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#E6EAF3] text-[12px] font-semibold hover:bg-white transition-colors text-slate-600">
            <FileText size={13} className="text-slate-500" /> PDF
          </button>
          <button onClick={() => exportSingleCallToCSV(call)} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#E6EAF3] text-[12px] font-semibold hover:bg-white transition-colors text-slate-600">
            <FileSpreadsheet size={13} className="text-slate-500" /> CSV
          </button>
        </div>
      </div>
    </div>
  );
}
