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
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp } from "@/lib/utils";
import { exportCallToPDF, exportSingleCallToCSV } from "@/lib/exportUtils";

interface DetailProfilePanelProps {
  call: Call;
  onClose: () => void;
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

  return (
    <div className="w-[360px] min-w-[320px] bg-panel-bg border-l border-border h-full flex flex-col shrink-0">
      {/* Header */}
      <div className="h-[64px] px-5 flex items-center justify-between border-b border-border shrink-0">
        <h3 className="text-[14px] font-semibold text-foreground">Zusammenfassung</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Call metadata card */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <PhoneCall size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[14px] font-semibold leading-tight mb-1">{call.subject}</h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-semibold", status.color)}>
                  {status.label}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                  <Clock size={12} />
                  {formatDuration(call.duration)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            {formatTimestamp(call.timestamp)} &middot; {call.employeeAssigned}
          </p>
        </div>

        {/* Summary section */}
        <div className="px-5 py-5 border-b border-border">
          <h4 className="text-[13px] font-semibold text-foreground mb-3">Zusammenfassung</h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-[13px] text-foreground/80 leading-relaxed">
              {call.summary}
            </p>
          </div>
        </div>

        {/* Key points */}
        <div className="px-5 py-5 border-b border-border">
          <h4 className="text-[13px] font-semibold text-foreground mb-3">Wichtige Punkte</h4>
          <div className="space-y-2.5">
            {call.summaryBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[13px]">
                <span className="w-2 h-2 rounded-full bg-primary mt-[6px] shrink-0" />
                <span className="text-foreground/80 leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* To-do list */}
        <div className="px-5 py-5 border-b border-border">
          <h4 className="text-[13px] font-semibold text-foreground mb-3">Aufgaben</h4>
          <div className="space-y-1.5">
            {call.summaryBullets.map((bullet, i) => {
              const isChecked = checkedItems.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {isChecked ? (
                    <CheckSquare size={18} className="text-primary shrink-0 mt-0.5" />
                  ) : (
                    <Square size={18} className="text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <span className={cn(
                    "text-[13px] leading-relaxed",
                    isChecked ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {bullet}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 px-1">
            {checkedItems.size} von {call.summaryBullets.length} erledigt
          </p>
        </div>

        {/* Contact info */}
        <div className="px-5 py-5 border-b border-border">
          <h4 className="text-[13px] font-semibold text-foreground mb-3">Kontakt</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[13px]">
              <Phone size={15} className="text-muted-foreground shrink-0" />
              <span className="text-foreground">{call.customerPhone}</span>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <Mail size={15} className="text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{call.customerEmail}</span>
            </div>
            {call.customerRole && (
              <div className="flex items-center gap-3 text-[13px]">
                <User size={15} className="text-muted-foreground shrink-0" />
                <span className="text-foreground">{call.customerRole}</span>
              </div>
            )}
            {call.customerCompany && (
              <div className="flex items-center gap-3 text-[13px]">
                <Building2 size={15} className="text-muted-foreground shrink-0" />
                <span className="text-foreground">{call.customerCompany}</span>
              </div>
            )}
          </div>
        </div>

        {/* Export buttons */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCallToPDF(call)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-[13px] font-medium hover:bg-gray-50 transition-colors"
            >
              <FileText size={14} />
              PDF
            </button>
            <button
              onClick={() => exportSingleCallToCSV(call)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-[13px] font-medium hover:bg-gray-50 transition-colors"
            >
              <FileSpreadsheet size={14} />
              CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
