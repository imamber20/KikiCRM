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
    label: "Erfolgreich",
  },
  nicht_erfolgreich: {
    icon: <PhoneMissed size={13} />,
    color: "text-red-500",
    label: "Nicht erfolgreich",
  },
  weitergeleitet: {
    icon: <PhoneForwarded size={13} />,
    color: "text-amber-500",
    label: "Weitergeleitet",
  },
};

// Deterministic avatar colors
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
      <div className="w-[340px] min-w-[300px] bg-panel-bg border-r border-border flex flex-col h-full shrink-0">

        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          {/* Search row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Suche nach Kunde, Datum, Stichwort..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-panel-header border border-transparent text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative shrink-0",
                activeFilterCount > 0
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-panel-header"
              )}
              title="Filter"
            >
              <SlidersHorizontal size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Section label */}
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
            Anrufe{calls.length > 0 && <span className="ml-1.5 text-primary">{calls.length}</span>}
          </p>
        </div>

        {/* Call list */}
        <div className="flex-1 overflow-y-auto">
          {calls.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground px-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Phone size={20} className="opacity-40" />
              </div>
              <p className="text-[13px] text-center font-medium">Keine Anrufe gefunden</p>
              <p className="text-[11px] text-center mt-1 opacity-70">Versuchen Sie andere Suchbegriffe</p>
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
                  "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer border-b border-border/40",
                  isSelected
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-gray-50/80 border-l-2 border-l-transparent"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm",
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
                  <p className="text-[12px] text-muted-foreground truncate leading-tight">
                    {call.subject}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 truncate mt-0.5">
                    {formatTimestamp(call.timestamp)}
                  </p>
                </div>

                {/* Right: duration + actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[12px] font-semibold tabular-nums text-foreground/70">
                    {formatDuration(call.duration)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <span
                      role="button"
                      tabIndex={0}
                      className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-gray-200 hover:text-foreground transition-colors"
                      title="Abspielen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:bg-gray-200 hover:text-foreground transition-colors"
                      title="Herunterladen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
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
