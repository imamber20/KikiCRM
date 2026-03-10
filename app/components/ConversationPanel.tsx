"use client";

import {
  PhoneCall,
  MoreHorizontal,
  Phone,
  MessageSquare,
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

const statusColors: Record<string, string> = {
  erfolgreich: "bg-emerald-100 text-emerald-700",
  nicht_erfolgreich: "bg-red-100 text-red-700",
  weitergeleitet: "bg-amber-100 text-amber-700",
};

// Deterministic avatar colors (same logic as CallListPanel)
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

export default function ConversationPanel({ call, onMoreClick }: ConversationPanelProps) {
  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <div className="text-center text-muted-foreground">
          <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Phone size={32} className="text-primary/40" />
          </div>
          <p className="text-lg font-semibold text-foreground/60">Kiki CRM</p>
          <p className="text-sm mt-1 text-muted-foreground">Wählen Sie einen Anruf aus der Liste</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Header bar */}
      <div className="h-[64px] bg-panel-bg border-b border-border px-5 flex items-center justify-between shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
            getAvatarColor(call.customerName)
          )}>
            {getInitials(call.customerName)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-[14px] text-foreground truncate leading-tight">{call.customerName}</h2>
            <p className="text-[12px] text-muted-foreground truncate">{call.customerPhone}</p>
          </div>
        </div>
        {/* Subject pill */}
        <div className="hidden sm:block mx-4">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium whitespace-nowrap truncate max-w-[200px] block">
            {call.subject}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-muted-foreground" title="Anrufen">
            <PhoneCall size={17} />
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-muted-foreground" title="Nachricht">
            <MessageSquare size={17} />
          </button>
          <button
            onClick={onMoreClick}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-muted-foreground"
            title="Zusammenfassung & Aufgaben"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      {/* Chat / Conversation area */}
      <div className="flex-1 overflow-y-auto bg-chat-bg px-4 sm:px-6 lg:px-10 py-5">

        {/* Date divider */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-border/60" />
            <span className="px-3 py-1 bg-white/80 rounded-full text-[11px] text-muted-foreground shadow-sm font-medium">
              {formatTimestamp(call.timestamp)}
            </span>
            <div className="h-px w-12 bg-border/60" />
          </div>
        </div>

        {/* Kiki summary bubble */}
        <div className="flex justify-start mb-5">
          <div className="flex items-start gap-2.5 max-w-[520px]">
            {/* Kiki avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-5 shadow-sm">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground mb-1.5 ml-0.5 font-medium">
                Kiki (KI) &nbsp;·&nbsp; {formatTimestamp(call.timestamp)}
              </p>
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                {/* Call header inside bubble */}
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <PhoneCall size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-foreground truncate">{call.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-semibold", statusColors[call.status])}>
                        {statusLabels[call.status]}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{formatDuration(call.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Summary bullets */}
                <div className="space-y-2 mb-3">
                  {call.summaryBullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-foreground/80 leading-relaxed">{bullet}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground border-t border-gray-100 pt-2">
                  Mitarbeiter: <span className="font-medium text-foreground/70">{call.employeeAssigned}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recording bubble */}
        <div className="flex justify-start mb-5">
          <div className="flex items-start gap-2.5 max-w-[520px] w-full">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-5 shadow-sm">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground mb-1.5 ml-0.5 font-medium">
                Aufnahme
              </p>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
                <AudioPlayerInline audioUrl={call.audioUrl} duration={call.duration} />
              </div>
            </div>
          </div>
        </div>

        {/* Transcript conversation bubbles */}
        {call.transcript.map((line, idx) => {
          const isKiki = line.speaker === "Kiki";
          return (
            <div
              key={idx}
              className={cn(
                "flex mb-4",
                isKiki ? "justify-start" : "justify-end"
              )}
            >
              {/* Kiki: avatar on left */}
              {isKiki && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0 mr-2 mt-5 shadow-sm">
                  K
                </div>
              )}

              <div className={cn("flex flex-col", isKiki ? "items-start" : "items-end", "max-w-[75%]")}>
                <p className="text-[11px] text-muted-foreground mb-1 mx-1 font-medium">
                  {isKiki ? "Kiki (KI)" : call.customerName}
                </p>
                <div className={cn(
                  "px-3.5 py-2.5 rounded-2xl text-[13px] shadow-sm leading-relaxed",
                  isKiki
                    ? "bg-white text-foreground rounded-tl-sm"
                    : "bg-primary-light text-foreground rounded-tr-sm"
                )}>
                  {line.text}
                </div>
              </div>

              {/* Customer: avatar on right */}
              {!isKiki && (
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ml-2 mt-5 shadow-sm",
                  getAvatarColor(call.customerName)
                )}>
                  {getInitials(call.customerName)}
                </div>
              )}
            </div>
          );
        })}

        {/* Missed call bubble */}
        {call.status === "nicht_erfolgreich" && (
          <div className="flex justify-center my-5">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2.5 border border-red-100">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Phone size={13} className="text-red-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Verpasster Anruf</p>
                <p className="text-[11px] text-muted-foreground">Nicht erreicht</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}
