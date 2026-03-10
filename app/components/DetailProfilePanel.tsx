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
  // Generate todo items from summary bullets — these are the action items from the call
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
    <div className="w-[340px] min-w-[300px] bg-panel-bg border-l border-border h-full flex flex-col shrink-0">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-border shrink-0">
        <h3 className="text-sm font-semibold">Zusammenfassung</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Call metadata */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <PhoneCall size={16} className="text-primary shrink-0" />
            <h4 className="text-sm font-semibold truncate">{call.subject}</h4>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", status.color)}>
              {status.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              {formatDuration(call.duration)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatTimestamp(call.timestamp)} &middot; {call.employeeAssigned}
          </p>
        </div>

        {/* Summary section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">Zusammenfassung</h4>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {call.summary}
            </p>
          </div>
        </div>

        {/* Key points */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">Wichtige Punkte</h4>
          <div className="space-y-2">
            {call.summaryBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-foreground/80">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* To-do list */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">Aufgaben</h4>
          <div className="space-y-1">
            {call.summaryBullets.map((bullet, i) => {
              const isChecked = checkedItems.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {isChecked ? (
                    <CheckSquare size={16} className="text-primary shrink-0 mt-0.5" />
                  ) : (
                    <Square size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span className={cn(
                    "text-sm",
                    isChecked ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {bullet}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {checkedItems.size} von {call.summaryBullets.length} erledigt
          </p>
        </div>

        {/* Contact info (compact) */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2">Kontakt</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-muted-foreground shrink-0" />
              <span className="text-foreground">{call.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{call.customerEmail}</span>
            </div>
            {call.customerRole && (
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground">{call.customerRole}</span>
              </div>
            )}
            {call.customerCompany && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground">{call.customerCompany}</span>
              </div>
            )}
          </div>
        </div>

        {/* Export buttons */}
        <div className="space-y-2">
          <button
            onClick={() => exportCallToPDF(call)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FileText size={14} />
            Export PDF
          </button>
          <button
            onClick={() => exportSingleCallToCSV(call)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={14} />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
