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
    icon: <PhoneIncoming size={14} />,
    color: "text-emerald-500",
  },
  nicht_erfolgreich: {
    icon: <PhoneMissed size={14} />,
    color: "text-red-500",
  },
  weitergeleitet: {
    icon: <PhoneForwarded size={14} />,
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
      <div className="w-[360px] min-w-[300px] bg-panel-bg border-r border-border flex flex-col h-full shrink-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          {/* Search row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche nach Kunde, Datum, Stichwort..."
                className="w-full pl-9 pr-3 py-[9px] rounded-lg bg-panel-header border-0 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className={cn(
                "p-2.5 rounded-lg transition-colors relative shrink-0",
                activeFilterCount > 0
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-panel-header"
              )}
              title="Filter"
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Call list */}
        <div className="flex-1 overflow-y-auto">
          {calls.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Phone size={32} className="mb-3 opacity-40" />
              <p className="text-sm">Keine Anrufe gefunden</p>
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
                  "flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-border/40 cursor-pointer",
                  isSelected
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-gray-50 border-l-2 border-l-transparent"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0",
                  getAvatarColor(call.customerName)
                )}>
                  {getInitials(call.customerName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={cn(
                      "font-semibold text-[13px] truncate",
                      isRedName ? "text-red-500" : "text-foreground"
                    )}>
                      {call.customerName}
                    </span>
                    <span className={cn("shrink-0", status.color)}>
                      {status.icon}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground truncate leading-relaxed">
                    {call.subject}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    {formatTimestamp(call.timestamp)}
                  </p>
                </div>

                {/* Right side: duration + actions */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[13px] font-semibold tabular-nums text-foreground">
                    {formatDuration(call.duration)}
                  </span>
                  <div className="flex items-center gap-0.5 text-muted-foreground/60">
                    <span
                      role="button"
                      tabIndex={0}
                      className="p-1 rounded hover:bg-gray-200 hover:text-muted-foreground transition-colors inline-flex"
                      title="Abspielen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="p-1 rounded hover:bg-gray-200 hover:text-muted-foreground transition-colors inline-flex"
                      title="Herunterladen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter panel */}
      <FilterBar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={onFiltersChange}
      />
    </>
  );
}
