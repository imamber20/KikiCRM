"use client";

import {
  MessageSquare,
  PhoneCall,
  MoreHorizontal,
  Send,
  Plus,
  Smile,
  Phone,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import AudioPlayerInline from "./AudioPlayerInline";

interface ConversationPanelProps {
  call: Call | null;
  onNameClick: () => void;
}

const statusLabels: Record<string, string> = {
  erfolgreich: "Erfolgreich",
  nicht_erfolgreich: "Nicht erfolgreich",
  weitergeleitet: "Weitergeleitet",
};

export default function ConversationPanel({ call, onNameClick }: ConversationPanelProps) {
  if (!call) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
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
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Header bar */}
      <div className="h-[60px] bg-panel-bg border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onNameClick}
            className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {getInitials(call.customerName)}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm truncate">{call.customerName}</h2>
              <p className="text-xs text-muted-foreground truncate">{call.customerPhone}</p>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground" title="Nachricht">
            <MessageSquare size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground" title="Anrufen">
            <PhoneCall size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground" title="Mehr">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Chat / Conversation area */}
      <div className="flex-1 overflow-y-auto bg-chat-bg px-4 sm:px-8 lg:px-16 py-6">
        {/* Date divider */}
        <div className="flex items-center justify-center mb-6">
          <span className="px-3 py-1 bg-white/80 rounded-lg text-xs text-muted-foreground shadow-sm">
            {formatTimestamp(call.timestamp).split(",")[0] || "Heute"}
          </span>
        </div>

        {/* Call info bubble from agent */}
        <div className="flex justify-start mb-4">
          <div className="flex items-start gap-2 max-w-[480px]">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
              K
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {call.customerName} &middot; {formatTimestamp(call.timestamp).split(",")[1]?.trim() || "08:34"}
              </div>
              <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <PhoneCall size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{call.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {statusLabels[call.status]} &middot; {formatDuration(call.duration)}
                    </p>
                  </div>
                </div>

                {/* Summary bullets */}
                <div className="space-y-1.5 mb-3">
                  {call.summaryBullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-foreground/80">{bullet}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Mitarbeiter: {call.employeeAssigned}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recording bubble */}
        <div className="flex justify-start mb-4">
          <div className="flex items-start gap-2 max-w-[480px] w-full">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
              K
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">
                Aufnahme
              </div>
              <div className="bg-white rounded-2xl rounded-tl-md p-3 shadow-sm">
                <AudioPlayerInline audioUrl={call.audioUrl} duration={call.duration} />
              </div>
            </div>
          </div>
        </div>

        {/* Transcript as conversation bubbles */}
        {call.transcript.map((line, idx) => {
          const isKiki = line.speaker === "Kiki";
          return (
            <div
              key={idx}
              className={cn(
                "flex mb-3",
                isKiki ? "justify-start" : "justify-end"
              )}
            >
              <div className={cn(
                "max-w-[400px] px-3 py-2 rounded-2xl text-sm shadow-sm",
                isKiki
                  ? "bg-white rounded-tl-md text-foreground"
                  : "bg-primary-light rounded-tr-md text-foreground"
              )}>
                <p className="text-[11px] font-semibold mb-0.5 text-muted-foreground">
                  {line.speaker === "Kiki" ? "Kiki (KI)" : call.customerName}
                </p>
                <p>{line.text}</p>
              </div>
            </div>
          );
        })}

        {/* Missed call bubble (if nicht_erfolgreich) */}
        {call.status === "nicht_erfolgreich" && (
          <div className="flex justify-start mb-4 mt-4">
            <div className="flex items-start gap-2 max-w-[320px]">
              <div className="w-7 h-7 shrink-0" />
              <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2">
                <PhoneCall size={14} className="text-red-500" />
                <div>
                  <p className="text-sm font-medium">Verpasster Anruf</p>
                  <p className="text-xs text-muted-foreground">Nicht erreicht</p>
                </div>
                <button className="ml-2 p-1 rounded hover:bg-gray-100 text-muted-foreground">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message input bar */}
      <div className="h-[60px] bg-panel-bg border-t border-border px-4 flex items-center gap-3 shrink-0">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground transition-colors">
          <Smile size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Nachricht schreiben..."
            className="w-full px-4 py-2 rounded-lg bg-panel-header border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground transition-colors">
          <Plus size={20} />
        </button>
        <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
