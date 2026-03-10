"use client";

import { Phone, PhoneCall, Search, MoreHorizontal } from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import AudioPlayerInline from "./AudioPlayerInline";

interface ConversationPanelProps {
  call: Call | null;
  onMoreClick: () => void;
}

const statusLabel: Record<string, string> = {
  erfolgreich:       "Erfolgreich",
  nicht_erfolgreich: "Nicht erfolgreich",
  weitergeleitet:    "Weitergeleitet",
};
const statusCls: Record<string, string> = {
  erfolgreich:       "bg-emerald-100 text-emerald-700",
  nicht_erfolgreich: "bg-red-100 text-red-700",
  weitergeleitet:    "bg-amber-100 text-amber-700",
};

const avatarPalette = [
  "#3B82F6","#10B981","#8B5CF6","#F43F5E",
  "#F59E0B","#06B6D4","#6366F1","#EC4899","#14B8A6","#F97316",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarPalette[Math.abs(h) % avatarPalette.length];
}

function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationPanel({ call, onMoreClick }: ConversationPanelProps) {
  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F7F8FC]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Phone size={30} className="text-primary/40" />
          </div>
          <p className="text-[16px] font-semibold text-foreground/50">Kiki CRM</p>
          <p className="text-[13px] text-muted-foreground mt-1">Wählen Sie einen Anruf aus der Liste</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-white">

      {/* ── Header ─────────────────────────────────── */}
      <div className="h-[68px] px-6 flex items-center justify-between border-b border-border shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-[13px]"
            style={{ backgroundColor: avatarColor(call.customerName) }}
          >
            {getInitials(call.customerName)}
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-foreground leading-none">{call.customerName}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">{call.customerPhone}</p>
          </div>
        </div>

        {/* Subject tag */}
        <div className="mx-4 hidden md:block">
          <span className="px-3 py-1 bg-primary/8 text-primary text-[12px] font-medium rounded-full border border-primary/15 truncate max-w-[180px] block">
            {call.subject}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {[
            { icon: <Search size={16} />,        title: "Suche"          },
            { icon: <PhoneCall size={16} />,      title: "Anrufen"       },
            { icon: <MoreHorizontal size={16} />, title: "Zusammenfassung", action: onMoreClick },
          ].map(({ icon, title, action }, i) => (
            <button
              key={i}
              onClick={action}
              title={title}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat area ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-[#F7F8FC] px-8 py-6 space-y-1">

        {/* Date divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-semibold text-muted-foreground px-3 py-1 bg-white rounded-full border border-border shadow-sm">
            {formatTimestamp(call.timestamp)}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Kiki AI summary card ── */}
        <div className="flex items-start gap-3 mb-2 pb-2">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            K
          </div>
          {/* Bubble */}
          <div className="max-w-[520px]">
            <p className="text-[12px] font-semibold text-foreground/70 mb-1.5">Kiki (KI)</p>
            <div className="bg-white rounded-2xl rounded-tl-sm p-5 shadow-sm border border-border/60">
              {/* Call subject + meta */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border/50">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <PhoneCall size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground leading-tight">{call.subject}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", statusCls[call.status])}>
                      {statusLabel[call.status]}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatDuration(call.duration)}</span>
                    <span className="text-[11px] text-muted-foreground">· {call.employeeAssigned}</span>
                  </div>
                </div>
              </div>
              {/* Bullets */}
              <ul className="space-y-2">
                {call.summaryBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-foreground/75 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-[5px] shrink-0 opacity-80" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 ml-1">{timeOnly(call.timestamp)}</p>
          </div>
        </div>

        {/* ── Recording card ── */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            K
          </div>
          <div className="max-w-[420px] w-full">
            <p className="text-[12px] font-semibold text-foreground/70 mb-1.5">Aufnahme</p>
            <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-border/60">
              <AudioPlayerInline audioUrl={call.audioUrl} duration={call.duration} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 ml-1">{timeOnly(call.timestamp)}</p>
          </div>
        </div>

        {/* ── Transcript messages ── */}
        {call.transcript.map((line, idx) => {
          const isKiki = line.speaker === "Kiki";
          const prev = idx > 0 ? call.transcript[idx - 1].speaker : null;
          const isFirst = line.speaker !== prev;
          const next = idx < call.transcript.length - 1 ? call.transcript[idx + 1].speaker : null;
          const isLast = line.speaker !== next;

          return (
            <div
              key={idx}
              className={cn(
                "flex items-end gap-2.5",
                isKiki ? "justify-start" : "justify-end",
                isFirst ? "mt-5" : "mt-1"
              )}
            >
              {/* Kiki avatar — only on last bubble of a group (bottom-aligned) */}
              {isKiki && (
                <div className="w-9 shrink-0">
                  {isLast && (
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold">
                      K
                    </div>
                  )}
                </div>
              )}

              <div className={cn("flex flex-col max-w-[62%]", isKiki ? "items-start" : "items-end")}>
                {/* Name label — only on first bubble of group */}
                {isFirst && (
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 px-1">
                    {isKiki ? "Kiki (KI)" : call.customerName}
                  </p>
                )}

                {/* Bubble */}
                <div className={cn(
                  "px-4 py-2.5 text-[13px] leading-relaxed",
                  isKiki
                    ? cn("bg-white text-foreground shadow-sm border border-border/50",
                        isFirst ? "rounded-2xl rounded-tl-sm" : "rounded-2xl")
                    : cn("text-foreground shadow-sm",
                        "bg-[#E8FBF2] border border-emerald-100",
                        isFirst ? "rounded-2xl rounded-tr-sm" : "rounded-2xl")
                )}>
                  {line.text}
                </div>

                {/* Timestamp — only on last bubble of group */}
                {isLast && (
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">
                    {timeOnly(call.timestamp)}
                  </p>
                )}
              </div>

              {/* Customer avatar — only on last bubble of group */}
              {!isKiki && (
                <div className="w-9 shrink-0">
                  {isLast && (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                      style={{ backgroundColor: avatarColor(call.customerName) }}
                    >
                      {getInitials(call.customerName)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Missed call indicator */}
        {call.status === "nicht_erfolgreich" && (
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-full px-5 py-2.5 shadow-sm border border-red-100 flex items-center gap-2.5">
              <Phone size={13} className="text-red-500" />
              <span className="text-[12px] font-semibold text-foreground/70">Verpasster Anruf</span>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
