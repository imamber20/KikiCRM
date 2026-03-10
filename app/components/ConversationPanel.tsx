"use client";

import {
  PhoneCall,
  MoreHorizontal,
  Phone,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import AudioPlayerInline from "./AudioPlayerInline";

interface ConversationPanelProps {
  call: Call | null;
  onMoreClick: () => void;
}

const statusLabels: Record<string, string> = {
  erfolgreich: "Erfolgreich",
  nicht_erfolgreich: "Nicht erfolgreich",
  weitergeleitet: "Weitergeleitet",
};

export default function ConversationPanel({ call, onMoreClick }: ConversationPanelProps) {
  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg min-w-0">
        <div className="text-center text-muted-foreground">
          <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4">
            <Phone size={32} className="text-primary/40" />
          </div>
          <p className="text-lg font-medium text-foreground/60">Kiki CRM</p>
          <p className="text-sm mt-1">Wählen Sie einen Anruf aus der Liste</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
      {/* Header bar */}
      <div className="h-[64px] bg-panel-bg border-b border-border px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {getInitials(call.customerName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <h2 className="font-semibold text-[14px] truncate">{call.customerName}</h2>
              <span className="text-[12px] text-muted-foreground shrink-0">{call.customerPhone}</span>
            </div>
            <p className="text-[12px] text-primary font-medium truncate">{call.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground" title="Anrufen">
            <PhoneCall size={18} />
          </button>
          <button
            onClick={onMoreClick}
            className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground"
            title="Zusammenfassung & Aufgaben"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Chat / Conversation area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-chat-bg">
        <div className="max-w-[720px] mx-auto px-6 py-6">
          {/* Date divider */}
          <div className="flex items-center justify-center mb-8">
            <span className="px-4 py-1.5 bg-white/90 rounded-lg text-[12px] text-muted-foreground shadow-sm font-medium">
              {formatTimestamp(call.timestamp)}
            </span>
          </div>

          {/* Call info bubble from agent */}
          <div className="flex justify-start mb-5">
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                K
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-muted-foreground mb-1.5 px-1">
                  Kiki (KI) &middot; {formatTimestamp(call.timestamp)}
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <PhoneCall size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold leading-tight">{call.subject}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {statusLabels[call.status]} &middot; {formatDuration(call.duration)}
                      </p>
                    </div>
                  </div>

                  {/* Summary bullets */}
                  <div className="space-y-2 mb-3 pl-1">
                    {call.summaryBullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 text-[13px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[7px] shrink-0" />
                        <span className="text-foreground/80 leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-muted-foreground border-t border-border/50 pt-2 mt-2">
                    Mitarbeiter: {call.employeeAssigned}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recording bubble */}
          <div className="flex justify-start mb-5">
            <div className="flex items-start gap-2.5 max-w-[85%] w-full">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                K
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-muted-foreground mb-1.5 px-1">
                  Aufnahme
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
                  <AudioPlayerInline audioUrl={call.audioUrl} duration={call.duration} />
                </div>
              </div>
            </div>
          </div>

          {/* Transcript as conversation bubbles */}
          <div className="space-y-4">
            {call.transcript.map((line, idx) => {
              const isKiki = line.speaker === "Kiki";
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex",
                    isKiki ? "justify-start" : "justify-end"
                  )}
                >
                  <div className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm",
                    isKiki
                      ? "bg-white rounded-tl-sm text-foreground"
                      : "bg-primary-light rounded-tr-sm text-foreground"
                  )}>
                    <p className="text-[11px] font-semibold mb-1 text-muted-foreground">
                      {line.speaker === "Kiki" ? "Kiki (KI)" : call.customerName}
                    </p>
                    <p className="leading-relaxed">{line.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Missed call bubble (if nicht_erfolgreich) */}
          {call.status === "nicht_erfolgreich" && (
            <div className="flex justify-start mt-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 shrink-0" />
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                  <PhoneCall size={16} className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium">Verpasster Anruf</p>
                    <p className="text-[11px] text-muted-foreground">Nicht erreicht</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
