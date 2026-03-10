"use client";

import { Phone, PhoneCall, Search, MoreHorizontal, CheckCheck } from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import AudioPlayerInline from "./AudioPlayerInline";

interface ConversationPanelProps {
  call: Call | null;
  onMoreClick: () => void;
}

const statusLabel: Record<string, string> = {
  erfolgreich: "Erfolgreich",
  nicht_erfolgreich: "Nicht erfolgreich",
  weitergeleitet: "Weitergeleitet",
};
const statusCls: Record<string, string> = {
  erfolgreich: "bg-emerald-100 text-emerald-700",
  nicht_erfolgreich: "bg-red-100 text-red-700",
  weitergeleitet: "bg-amber-100 text-amber-700",
};

const avatarPalette = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F43F5E",
  "#F59E0B", "#06B6D4", "#6366F1", "#EC4899", "#14B8A6", "#F97316",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarPalette[Math.abs(h) % avatarPalette.length];
}

function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

const topTabs = ["Status", "Appeals", "Last contact", "Subscribed", "Location", "New user", "Settings"];

export default function ConversationPanel({ call, onMoreClick }: ConversationPanelProps) {
  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F4F7FD]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Phone size={30} className="text-indigo-300" />
          </div>
          <p className="text-[16px] font-semibold text-foreground/60">Kiki CRM</p>
          <p className="text-[13px] text-muted-foreground mt-1">Wähle links eine Konversation aus.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-[#F4F7FD]">
      <div className="h-[74px] px-7 flex items-center justify-between border-b border-[#E6EAF3] shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-white font-bold text-[13px]"
            style={{ backgroundColor: avatarColor(call.customerName) }}
          >
            {getInitials(call.customerName)}
          </div>
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-slate-900 leading-none">{call.customerName}</h2>
            <p className="text-[12px] text-muted-foreground mt-1">{call.customerPhone}</p>
          </div>
        </div>

        <div className="mx-4 hidden lg:block">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[12px] font-medium rounded-full border border-indigo-100 truncate max-w-[220px] block">
            {call.subject}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { icon: <Search size={16} />, title: "Suche" },
            { icon: <PhoneCall size={16} />, title: "Anrufen" },
            { icon: <MoreHorizontal size={16} />, title: "Zusammenfassung", action: onMoreClick },
          ].map(({ icon, title, action }, i) => (
            <button
              key={i}
              onClick={action}
              title={title}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="px-7 py-3 bg-white border-b border-[#E6EAF3] overflow-x-auto shrink-0">
        <div className="flex items-center gap-2 min-w-max">
          {topTabs.map((tab, index) => (
            <button
              key={tab}
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors",
                index === 0 ? "bg-emerald-100 text-emerald-700" : "bg-[#F4F6FC] text-slate-600 hover:bg-slate-200"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-7 space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#DCE2EF]" />
          <span className="text-[11px] font-semibold text-slate-500 px-3 py-1 bg-white rounded-full border border-[#E7EBF4] shadow-sm">
            {formatTimestamp(call.timestamp)}
          </span>
          <div className="flex-1 h-px bg-[#DCE2EF]" />
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">K</div>
          <div className="max-w-[560px]">
            <p className="text-[12px] font-semibold text-slate-500 mb-1.5">Kiki (AI Assistant)</p>
            <div className="bg-white rounded-3xl rounded-tl-sm p-5 shadow-sm border border-[#E6EAF3]">
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[#EDF1F8]">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <PhoneCall size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-900 leading-tight">{call.subject}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", statusCls[call.status])}>{statusLabel[call.status]}</span>
                    <span className="text-[11px] text-slate-500">{formatDuration(call.duration)}</span>
                    <span className="text-[11px] text-slate-500">· {call.employeeAssigned}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {call.summaryBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-600 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-[6px] shrink-0 opacity-80" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 ml-1">{timeOnly(call.timestamp)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">K</div>
          <div className="max-w-[420px] w-full">
            <p className="text-[12px] font-semibold text-slate-500 mb-1.5">Aufnahme</p>
            <div className="bg-white rounded-3xl rounded-tl-sm p-4 shadow-sm border border-[#E6EAF3]">
              <AudioPlayerInline audioUrl={call.audioUrl} duration={call.duration} />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 ml-1">{timeOnly(call.timestamp)}</p>
          </div>
        </div>

        {call.transcript.map((line, idx) => {
          const isKiki = line.speaker === "Kiki";
          const prev = idx > 0 ? call.transcript[idx - 1].speaker : null;
          const isFirst = line.speaker !== prev;
          const next = idx < call.transcript.length - 1 ? call.transcript[idx + 1].speaker : null;
          const isLast = line.speaker !== next;

          return (
            <div key={idx} className={cn("flex items-end gap-2.5", isKiki ? "justify-start" : "justify-end", isFirst ? "mt-2" : "-mt-2") }>
              {isKiki && <div className="w-9 shrink-0">{isLast && <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[11px] font-bold">K</div>}</div>}

              <div className={cn("flex flex-col max-w-[62%]", isKiki ? "items-start" : "items-end")}>
                {isFirst && <p className="text-[11px] font-semibold text-slate-500 mb-1.5 px-1">{isKiki ? "Kiki" : call.customerName}</p>}

                <div className={cn(
                  "px-4 py-3 text-[13px] leading-relaxed shadow-sm border",
                  isKiki
                    ? cn("bg-white text-slate-800 border-[#E6EAF3]", isFirst ? "rounded-2xl rounded-tl-sm" : "rounded-2xl")
                    : cn("text-slate-800 bg-[#DDF8EA] border-emerald-100", isFirst ? "rounded-2xl rounded-tr-sm" : "rounded-2xl")
                )}>
                  {line.text}
                </div>

                {isLast && (
                  <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-500">
                    <span>{timeOnly(call.timestamp)}</span>
                    {!isKiki && <CheckCheck size={12} className="text-indigo-400" />}
                  </div>
                )}
              </div>

              {!isKiki && (
                <div className="w-9 shrink-0">
                  {isLast && (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: avatarColor(call.customerName) }}>
                      {getInitials(call.customerName)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {call.status === "nicht_erfolgreich" && (
          <div className="flex justify-center mt-2">
            <div className="bg-white rounded-full px-5 py-2.5 shadow-sm border border-red-100 flex items-center gap-2.5">
              <Phone size={13} className="text-red-500" />
              <span className="text-[12px] font-semibold text-slate-600">Verpasster Anruf</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
