"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, Phone, PhoneMissed, PhoneForwarded, PhoneIncoming } from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, formatTimestamp, getInitials } from "@/lib/utils";
import FilterBar, { FilterState } from "./FilterBar";

interface CallListPanelProps {
  calls: Call[];
  selectedCall: Call | null;
  onSelectCall: (call: Call) => void;
  search: string;
  onSearchChange: (s: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

const statusConfig = {
  erfolgreich: {
    icon: <PhoneIncoming size={13} />,
    color: "text-emerald-500",
  },
  nicht_erfolgreich: {
    icon: <PhoneMissed size={13} />,
    color: "text-red-500",
  },
  weitergeleitet: {
    icon: <PhoneForwarded size={13} />,
    color: "text-amber-500",
  },
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

export default function CallListPanel({
  calls,
  selectedCall,
  onSelectCall,
  search,
  onSearchChange,
  filters,
  onFiltersChange,
}: CallListPanelProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount = [
    filters.timePeriod !== "all",
    filters.status.length > 0,
    filters.employee !== "",
    filters.keyword !== "",
    filters.phone !== "",
    filters.minDuration !== "" || filters.maxDuration !== "",
    filters.topic !== "",
  ].filter(Boolean).length;

  return (
    <>
      <div className="w-[360px] min-w-[320px] bg-panel-bg border-r border-border flex flex-col h-full shrink-0">
        <div className="px-4 pt-4 pb-3 shrink-0 border-b border-border/70 bg-white/85 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche nach Kunde, Datum, Stichwort..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-100 border border-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative shrink-0 border",
                activeFilterCount > 0
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-muted-foreground hover:bg-gray-100 border-border"
              )}
              title="Filter"
            >
              <SlidersHorizontal size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="px-4 py-2.5 border-b border-border bg-gray-50/80">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Anrufe
          </span>
          {calls.length > 0 && (
            <span className="text-[11px] font-bold text-primary ml-2">{calls.length}</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {calls.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground px-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Phone size={22} className="opacity-30" />
              </div>
              <p className="text-sm text-center font-medium">Keine Anrufe gefunden</p>
              <p className="text-xs text-center mt-1 opacity-60">Versuchen Sie andere Suchbegriffe</p>
            </div>
          )}

          {calls.map((call) => {
            const status = statusConfig[call.status];
            const isSelected = selectedCall?.id === call.id;
            const isRedName = call.status === "nicht_erfolgreich" || call.status === "weitergeleitet";

            return (
              <div
                key={call.id}
                onClick={() => onSelectCall(call)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectCall(call); }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all border-b border-border/60 min-w-0",
                  isSelected
                    ? "bg-primary/7"
                    : "hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0",
                  getAvatarColor(call.customerName)
                )}>
                  {getInitials(call.customerName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "font-semibold text-[14px] truncate leading-tight",
                      isRedName ? "text-red-500" : "text-foreground"
                    )}>
                      {call.customerName}
                    </span>
                    <span className={cn("shrink-0", status.color)}>{status.icon}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground truncate leading-tight mb-1">
                    {call.subject}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 leading-none">
                    {formatTimestamp(call.timestamp)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[12px] font-semibold tabular-nums text-foreground/60">
                    {formatDuration(call.duration)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      className="w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground/70 hover:bg-gray-100 hover:text-foreground transition-colors"
                      title="Abspielen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    </button>
                    <button
                      className="w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground/70 hover:bg-gray-100 hover:text-foreground transition-colors"
                      title="Herunterladen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FilterBar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={onFiltersChange}
      />
    </>
  );
}
