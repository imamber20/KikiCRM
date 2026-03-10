"use client";

import { useState } from "react";
import {
  X, Phone, Mail, Building2, User, FileText, FileSpreadsheet,
  CheckSquare, Square, Clock, PhoneCall, MessageSquare, MoreHorizontal,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import { exportCallToPDF, exportSingleCallToCSV } from "@/lib/exportUtils";

interface Props { call: Call; onClose: () => void; }

const avatarPalette = [
  "#3B82F6","#10B981","#8B5CF6","#F43F5E",
  "#F59E0B","#06B6D4","#6366F1","#EC4899","#14B8A6","#F97316",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarPalette[Math.abs(h) % avatarPalette.length];
}

const statusMap: Record<string, { label: string; cls: string }> = {
  erfolgreich:       { label: "Erfolgreich",       cls: "bg-emerald-100 text-emerald-700" },
  nicht_erfolgreich: { label: "Nicht erfolgreich", cls: "bg-red-100 text-red-700"        },
  weitergeleitet:    { label: "Weitergeleitet",     cls: "bg-amber-100 text-amber-700"    },
};

function Section({
  title, defaultOpen = false, count, children,
}: { title: string; defaultOpen?: boolean; count?: string | number; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-[13px] font-bold text-foreground">{title}</span>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="text-[11px] text-muted-foreground">{count}</span>
          )}
          {open
            ? <ChevronUp size={15} className="text-muted-foreground" />
            : <ChevronDown size={15} className="text-muted-foreground" />
          }
        </div>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

export default function DetailProfilePanel({ call, onClose }: Props) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => setChecked(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const status = statusMap[call.status] || statusMap.erfolgreich;
  const done = checked.size;
  const total = call.summaryBullets.length;

  return (
    <div className="w-[360px] min-w-[320px] h-full flex flex-col bg-white border-l border-border shrink-0">

      {/* ── Header ── */}
      <div className="h-[68px] px-5 flex items-center justify-between border-b border-border shrink-0">
        <h3 className="text-[16px] font-bold text-foreground">Anruf Details</h3>
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors text-muted-foreground flex items-center justify-center">
          <X size={17} />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Profile block */}
        <div className="px-5 py-6 flex flex-col items-center border-b border-border">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md mb-3"
            style={{ backgroundColor: avatarColor(call.customerName) }}
          >
            {getInitials(call.customerName)}
          </div>
          <h4 className="text-[16px] font-bold text-foreground text-center leading-tight">{call.customerName}</h4>
          <p className="text-[12px] text-muted-foreground mt-1">{call.customerPhone}</p>
          <div className="flex items-center gap-3 mt-4">
            <button className="w-10 h-10 rounded-full border border-border hover:border-primary/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-all" title="Nachricht">
              <MessageSquare size={16} />
            </button>
            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-md shadow-primary/25" title="Anrufen">
              <Phone size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-border hover:bg-gray-50 flex items-center justify-center text-muted-foreground transition-colors" title="Mehr">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Call info row */}
        <div className="px-5 py-4 border-b border-border bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PhoneCall size={15} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground truncate">{call.subject}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", status.cls)}>
                  {status.label}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />{formatDuration(call.duration)}
                </span>
                <span className="text-[11px] text-muted-foreground">· {call.employeeAssigned}</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 pl-12">{formatTimestamp(call.timestamp)}</p>
        </div>

        {/* ── Accordion sections ── */}

        <Section title="Zusammenfassung" defaultOpen>
          <p className="text-[13px] text-foreground/75 leading-relaxed">{call.summary}</p>
        </Section>

        <Section title="Wichtige Punkte" defaultOpen count={call.summaryBullets.length}>
          <ul className="space-y-2.5">
            {call.summaryBullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-primary mt-[5px] shrink-0" />
                <span className="text-[13px] text-foreground/80 leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Aufgaben" defaultOpen count={`${done}/${total}`}>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
            />
          </div>
          <div className="space-y-0.5">
            {call.summaryBullets.map((b, i) => {
              const isChecked = checked.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className="w-full flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {isChecked
                    ? <CheckSquare size={15} className="text-primary shrink-0 mt-0.5" />
                    : <Square size={15} className="text-gray-300 shrink-0 mt-0.5" />
                  }
                  <span className={cn("text-[13px] leading-snug",
                    isChecked ? "line-through text-muted-foreground" : "text-foreground/80"
                  )}>
                    {b}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Kontakt">
          <div className="space-y-3">
            {[
              { icon: <Phone size={14} />,    value: call.customerPhone },
              { icon: <Mail size={14} />,     value: call.customerEmail },
              call.customerRole    ? { icon: <User size={14} />,      value: call.customerRole }    : null,
              call.customerCompany ? { icon: <Building2 size={14} />, value: call.customerCompany } : null,
            ].filter(Boolean).map((row, i) => row && (
              <div key={i} className="flex items-center gap-3">
                <span className="text-primary shrink-0">{row.icon}</span>
                <span className="text-[13px] text-foreground truncate">{row.value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Export">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => exportCallToPDF(call)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-[12px] font-semibold hover:bg-gray-50 transition-colors text-foreground/70"
            >
              <FileText size={13} className="text-muted-foreground" /> PDF
            </button>
            <button
              onClick={() => exportSingleCallToCSV(call)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-[12px] font-semibold hover:bg-gray-50 transition-colors text-foreground/70"
            >
              <FileSpreadsheet size={13} className="text-muted-foreground" /> CSV
            </button>
          </div>
        </Section>

      </div>
    </div>
  );
}
