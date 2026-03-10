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
          <p className="text-sm mt-1">Wählen Sie einen Anruf aus der Liste</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <div className="h-16 bg-panel-bg border-b border-border px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0",
            getAvatarColor(call.customerName)
          )}>
            {getInitials(call.customerName)}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-foreground truncate leading-tight">{call.customerName}</h2>
            <p className="text-xs text-muted-foreground truncate">{call.customerPhone}</p>
          </div>
        </div>
        <div className="hidden md:block mx-4 min-w-0">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold truncate max-w-[240px] block border border-primary/20">
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
            title="Zusammenfassung"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-chat-bg px-5 lg:px-9 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="h-px flex-1 bg-black/5" />
          <span className="mx-4 px-3 py-1 bg-white rounded-full text-[11px] text-muted-foreground shadow-sm font-medium border border-border/60">
            {formatTimestamp(call.timestamp)}
          </span>
          <div className="h-px flex-1 bg-black/5" />
        </div>

        <div className="space-y-6 max-w-[760px]">
          <section className="rounded-2xl border border-border/80 bg-white/80 backdrop-blur-sm p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">KI Zusammenfassung</p>
            <div className="flex items-start gap-3 max-w-[640px]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                K
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">
                  Kiki (KI) · {formatTimestamp(call.timestamp)}
                </p>
                <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-border/70">
                  <p className="text-[15px] font-bold text-foreground mb-1">{call.subject}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", statusColors[call.status])}>
                      {statusLabels[call.status]}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatDuration(call.duration)}</span>
                  </div>
                  <ul className="space-y-2 mb-3">
                    {call.summaryBullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-foreground/85 leading-snug break-words [overflow-wrap:anywhere]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[6px] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-muted-foreground pt-2 border-t border-gray-100">
                    Mitarbeiter: {call.employeeAssigned}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-white/80 backdrop-blur-sm p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">Audio</p>
            <div className="flex items-start gap-3 max-w-[640px]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                K
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground mb-1.5 font-medium">Aufnahme</p>
                <div className="bg-white rounded-2xl rounded-tl-md p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-border/70">
                  <AudioPlayerInline audioUrl={call.audioUrl} duration={call.duration} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/80 bg-white/70 backdrop-blur-sm p-3.5 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1">Gespräch</p>
            {call.transcript.map((line, idx) => {
              const isKiki = line.speaker === "Kiki";
              const prevSpeaker = idx > 0 ? call.transcript[idx - 1].speaker : null;
              const isNewSpeaker = line.speaker !== prevSpeaker;

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex min-w-0",
                    isKiki ? "justify-start" : "justify-end",
                    isNewSpeaker ? "mt-4" : "mt-1.5"
                  )}
                >
                  {isKiki && (
                    <div className="w-8 shrink-0 mr-2.5">
                      {isNewSpeaker && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                          K
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cn("flex flex-col min-w-0 max-w-[min(72ch,72%)]", isKiki ? "items-start" : "items-end")}>
                    {isNewSpeaker && (
                      <p className="text-[11px] text-muted-foreground mb-1 mx-1 font-medium">
                        {isKiki ? "Kiki (KI)" : call.customerName}
                      </p>
                    )}
                    <div className={cn(
                      "px-4 py-2.5 text-[13px] leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 border",
                      isKiki
                        ? "bg-white text-foreground rounded-2xl rounded-tl-md shadow-[0_1px_2px_rgba(0,0,0,0.06)] border-border/80"
                        : "bg-primary-light text-foreground rounded-2xl rounded-tr-md shadow-[0_1px_2px_rgba(0,0,0,0.06)] border-primary/20"
                    )}>
                      {line.text}
                    </div>
                  </div>

                  {!isKiki && (
                    <div className="w-8 shrink-0 ml-2.5">
                      {isNewSpeaker && (
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
                          getAvatarColor(call.customerName)
                        )}>
                          {getInitials(call.customerName)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </div>

        {call.status === "nicht_erfolgreich" && (
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3 border border-red-100">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Phone size={14} className="text-red-500" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Verpasster Anruf</p>
                <p className="text-[11px] text-muted-foreground">Nicht erreicht</p>
              </div>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}
