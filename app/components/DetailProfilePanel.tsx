"use client";

import {
  X,
  MessageSquare,
  PhoneCall,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Clock,
  Building2,
  User,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, getInitials, formatTimestamp } from "@/lib/utils";
import { exportCallToPDF, exportSingleCallToCSV } from "@/lib/exportUtils";

interface DetailProfilePanelProps {
  call: Call;
  onClose: () => void;
}

// Deterministic avatar color from name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-rose-500",
    "bg-amber-500", "bg-cyan-500", "bg-indigo-500", "bg-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function DetailProfilePanel({ call, onClose }: DetailProfilePanelProps) {
  const smsPreview = `Hallo ${call.customerName.split(" ")[0]},\nIhre Dokumente für ${call.subject} wurden erfolgreich hochgeladen. Wir werden sie prüfen und uns bei Bedarf melden. Haben Sie Fragen? Antworten Sie hier oder rufen Sie uns an unter (555) 123-4567.`;

  return (
    <div className="w-[340px] min-w-[300px] bg-panel-bg border-l border-border h-full flex flex-col shrink-0">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-border shrink-0">
        <h3 className="text-sm font-semibold">Kundenprofil</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-5">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3",
            getAvatarColor(call.customerName)
          )}>
            {getInitials(call.customerName)}
          </div>
          <h3 className="text-base font-bold">{call.customerName}</h3>
          <p className="text-sm text-muted-foreground">{call.customerPhone}</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Nachricht">
            <MessageSquare size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Anrufen">
            <PhoneCall size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors" title="Mehr">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* SMS section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} className="text-primary" />
            <h4 className="text-sm font-semibold">SMS</h4>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-foreground/80 leading-relaxed">
            <p>Hallo {call.customerName.split(" ")[0]},</p>
            <p className="mt-1">Ihre Dokumente für {call.subject} wurden erfolgreich hochgeladen. Wir werden sie prüfen und uns bei Bedarf melden. Haben Sie Fragen? Antworten Sie hier oder rufen Sie uns an unter (555) 123-4567.</p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>{formatTimestamp(call.timestamp)}</span>
            <button className="ml-auto text-primary text-xs font-medium">
              &rsaquo;
            </button>
          </div>
        </div>

        {/* Calls Details */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Anrufdetails</h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} />
                <span>Gesamtanrufe</span>
              </div>
              <span className="text-sm font-semibold">{call.totalCalls}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>Durchschnittliche Dauer</span>
              </div>
              <span className="text-sm font-semibold">{call.avgCallTime}</span>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">Kontaktdaten</h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} />
                <span>Telefon</span>
              </div>
              <span className="text-sm font-medium">{call.customerPhone}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span>E-Mail</span>
              </div>
              <span className="text-sm font-medium truncate ml-4">{call.customerEmail}</span>
            </div>
            {call.customerRole && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User size={14} />
                  <span>Rolle</span>
                </div>
                <span className="text-sm font-medium">{call.customerRole}</span>
              </div>
            )}
            {call.customerCompany && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 size={14} />
                  <span>Firma</span>
                </div>
                <span className="text-sm font-medium">{call.customerCompany}</span>
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
