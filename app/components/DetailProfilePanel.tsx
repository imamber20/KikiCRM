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

// Deterministic avatar colors (same logic as other panels)
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
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    erfolgreich: { label: "Erfolgreich", color: "bg-emerald-100 text-emerald-700" },
    nicht_erfolgreich: { label: "Nicht erfolgreich", color: "bg-red-100 text-red-700" },
    weitergeleitet: { label: "Weitergeleitet", color: "bg-amber-100 text-amber-700" },
  };

  const status = statusLabels[call.status] || statusLabels.erfolgreich;
  const completedCount = checkedItems.size;
  const totalCount = call.summaryBullets.length;

  return (
    <div className="w-[340px] min-w-[300px] bg-panel-bg border-l border-border h-full flex flex-col shrink-0">

      {/* Header */}
      <div className="h-[64px] px-4 flex items-center justify-between border-b border-border shrink-0">
        <h3 className="text-[14px] font-semibold text-foreground">Detail Profil</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Customer profile hero */}
        <div className="flex flex-col items-center px-6 py-6 border-b border-border/60 bg-gradient-to-b from-gray-50/80 to-white">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md mb-3",
            getAvatarColor(call.customerName)
          )}>
            {getInitials(call.customerName)}
          </div>
          <h4 className="text-[15px] font-semibold text-foreground text-center leading-tight">{call.customerName}</h4>
          <p className="text-[12px] text-muted-foreground mt-0.5 text-center">{call.customerPhone}</p>

          {/* Quick action buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Nachricht">
              <MessageSquare size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Anrufen">
              <Phone size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-muted-foreground hover:bg-gray-200 transition-colors" title="Mehr">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-5">

          {/* Call metadata card */}
          <div className="bg-gray-50 rounded-xl p-3.5">
            <div className="flex items-start gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <PhoneCall size={13} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{call.subject}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", status.color)}>
                    {status.label}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock size={11} />
                    {formatDuration(call.duration)}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground pl-[38px]">
              {formatTimestamp(call.timestamp)} &nbsp;·&nbsp; {call.employeeAssigned}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h5 className="text-[12px] font-semibold text-foreground uppercase tracking-wide mb-2.5">Zusammenfassung</h5>
            <p className="text-[13px] text-foreground/75 leading-relaxed bg-gray-50 rounded-xl px-3.5 py-3">
              {call.summary}
            </p>
          </div>

          {/* Key points */}
          <div>
            <h5 className="text-[12px] font-semibold text-foreground uppercase tracking-wide mb-2.5">Wichtige Punkte</h5>
            <div className="space-y-2">
              {call.summaryBullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-foreground/80 leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h5 className="text-[12px] font-semibold text-foreground uppercase tracking-wide">Aufgaben</h5>
              <span className="text-[11px] text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
                {completedCount}/{totalCount}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-gray-200 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
              />
            </div>
            <div className="space-y-1">
              {call.summaryBullets.map((bullet, i) => {
                const isChecked = checkedItems.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleItem(i)}
                    className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    {isChecked ? (
                      <CheckSquare size={15} className="text-primary shrink-0 mt-0.5" />
                    ) : (
                      <Square size={15} className="text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground/50 transition-colors" />
                    )}
                    <span className={cn(
                      "text-[13px] leading-relaxed",
                      isChecked ? "line-through text-muted-foreground" : "text-foreground/80"
                    )}>
                      {bullet}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h5 className="text-[12px] font-semibold text-foreground uppercase tracking-wide mb-2.5">Kontakt</h5>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-gray-100">
                <Phone size={13} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-foreground">{call.customerPhone}</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-gray-100">
                <Mail size={13} className="text-muted-foreground shrink-0" />
                <span className="text-[13px] text-foreground truncate">{call.customerEmail}</span>
              </div>
              {call.customerRole && (
                <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-gray-100">
                  <User size={13} className="text-muted-foreground shrink-0" />
                  <span className="text-[13px] text-foreground">{call.customerRole}</span>
                </div>
              )}
              {call.customerCompany && (
                <div className="flex items-center gap-3 px-3.5 py-2.5">
                  <Building2 size={13} className="text-muted-foreground shrink-0" />
                  <span className="text-[13px] text-foreground truncate">{call.customerCompany}</span>
                </div>
              )}
            </div>
          </div>

          {/* Export buttons */}
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => exportCallToPDF(call)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-[12px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-foreground/80"
            >
              <FileText size={13} className="text-muted-foreground" />
              Export PDF
            </button>
            <button
              onClick={() => exportSingleCallToCSV(call)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-[12px] font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-foreground/80"
            >
              <FileSpreadsheet size={13} className="text-muted-foreground" />
              Export CSV
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
