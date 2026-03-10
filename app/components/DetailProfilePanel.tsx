"use client";

import { useState } from "react";
import {
  X,
  Phone,
  Mail,
  Building2,
  User,
  FileText,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Clock,
  PhoneCall,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import { exportCallToPDF, exportSingleCallToCSV } from "@/lib/exportUtils";

interface DetailProfilePanelProps {
  call: Call;
  onClose: () => void;
}

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-rose-500",
  "bg-amber-500", "bg-cyan-500", "bg-indigo-500", "bg-pink-500",
  "bg-teal-500", "bg-orange-500",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function DetailProfilePanel({ call, onClose }: DetailProfilePanelProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    erfolgreich: { label: "Erfolgreich", color: "bg-emerald-100 text-emerald-700" },
    nicht_erfolgreich: { label: "Nicht erfolgreich", color: "bg-red-100 text-red-700" },
    weitergeleitet: { label: "Weitergeleitet", color: "bg-amber-100 text-amber-700" },
  };

  const status = statusMap[call.status] || statusMap.erfolgreich;
  const completedCount = checkedItems.size;
  const totalCount = call.summaryBullets.length;

  return (
    <div className="w-[360px] min-w-[320px] bg-gray-50 border-l border-border h-full flex flex-col shrink-0">

      {/* Header */}
      <div className="h-16 px-5 flex items-center justify-between bg-white border-b border-border shrink-0">
        <h3 className="text-[14px] font-bold text-foreground">Detail Profil</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground flex items-center justify-center">
          <X size={16} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* ───── Profile hero card ───── */}
        <div className="bg-white mx-3 mt-3 rounded-xl border border-border p-5 flex flex-col items-center">
          <div className={cn(
            "w-[72px] h-[72px] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3",
            getAvatarColor(call.customerName)
          )}>
            {getInitials(call.customerName)}
          </div>
          <h4 className="text-[15px] font-bold text-foreground text-center">{call.customerName}</h4>
          <p className="text-[12px] text-muted-foreground mt-0.5">{call.customerPhone}</p>
          <div className="flex items-center gap-3 mt-4">
            <button className="w-10 h-10 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Nachricht">
              <MessageSquare size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Anrufen">
              <Phone size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-gray-50 transition-colors" title="Mehr">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* ───── Call info card ───── */}
        <div className="bg-white mx-3 mt-3 rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <PhoneCall size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground leading-tight">{call.subject}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", status.color)}>
                  {status.label}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock size={10} /> {formatDuration(call.duration)}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {formatTimestamp(call.timestamp)} · {call.employeeAssigned}
              </p>
            </div>
          </div>
        </div>

        {/* ───── Summary card ───── */}
        <div className="bg-white mx-3 mt-3 rounded-xl border border-border p-4">
          <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Zusammenfassung
          </h5>
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            {call.summary}
          </p>
        </div>

        {/* ───── Key points card ───── */}
        <div className="bg-white mx-3 mt-3 rounded-xl border border-border p-4">
          <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Wichtige Punkte
          </h5>
          <div className="space-y-2.5">
            {call.summaryBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-primary mt-[5px] shrink-0" />
                <span className="text-[13px] text-foreground/80 leading-snug">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ───── Tasks card ───── */}
        <div className="bg-white mx-3 mt-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Aufgaben
            </h5>
            <span className="text-[11px] text-muted-foreground font-medium">
              {completedCount}/{totalCount}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
            />
          </div>
          <div className="space-y-0.5">
            {call.summaryBullets.map((bullet, i) => {
              const isChecked = checkedItems.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className="w-full flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {isChecked ? (
                    <CheckSquare size={16} className="text-primary shrink-0 mt-0.5" />
                  ) : (
                    <Square size={16} className="text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <span className={cn(
                    "text-[13px] leading-snug",
                    isChecked ? "line-through text-muted-foreground" : "text-foreground/80"
                  )}>
                    {bullet}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ───── Contact card ───── */}
        <div className="bg-white mx-3 mt-3 rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-gray-50/50">
            <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Kontakt
            </h5>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <Phone size={14} className="text-primary shrink-0" />
              <span className="text-[13px] text-foreground">{call.customerPhone}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Mail size={14} className="text-primary shrink-0" />
              <span className="text-[13px] text-foreground truncate">{call.customerEmail}</span>
            </div>
            {call.customerRole && (
              <div className="flex items-center gap-3 px-4 py-3">
                <User size={14} className="text-primary shrink-0" />
                <span className="text-[13px] text-foreground">{call.customerRole}</span>
              </div>
            )}
            {call.customerCompany && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Building2 size={14} className="text-primary shrink-0" />
                <span className="text-[13px] text-foreground truncate">{call.customerCompany}</span>
              </div>
            )}
          </div>
        </div>

        {/* ───── Export buttons ───── */}
        <div className="grid grid-cols-2 gap-2 mx-3 mt-3 mb-4">
          <button
            onClick={() => exportCallToPDF(call)}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white border border-border text-[12px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors text-foreground/70"
          >
            <FileText size={14} className="text-muted-foreground" />
            Export PDF
          </button>
          <button
            onClick={() => exportSingleCallToCSV(call)}
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white border border-border text-[12px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors text-foreground/70"
          >
            <FileSpreadsheet size={14} className="text-muted-foreground" />
            Export CSV
          </button>
        </div>

      </div>
    </div>
  );
}
