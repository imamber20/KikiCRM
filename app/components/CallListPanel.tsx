"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, PhoneIncoming, PhoneMissed, PhoneForwarded } from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { cn, formatDuration, getInitials } from "@/lib/utils";
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

const avatarColors = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F43F5E",
  "#F59E0B", "#06B6D4", "#6366F1", "#EC4899",
  "#14B8A6", "#F97316",
];

function getAvatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return avatarColors[Math.abs(h) % avatarColors.length];
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const statusIcon = {
  erfolgreich: <PhoneIncoming size={12} className="text-emerald-500" />,
  nicht_erfolgreich: <PhoneMissed size={12} className="text-red-500" />,
  weitergeleitet: <PhoneForwarded size={12} className="text-amber-500" />,
};

export default function CallListPanel({
  calls, selectedCall, onSelectCall,
  search, onSearchChange, filters, onFiltersChange,
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
      <div className="w-[370px] min-w-[320px] bg-[#F8FAFF] flex flex-col h-full shrink-0 border-r border-[#E6EAF3]">
        <div className="px-5 pt-5 pb-4 shrink-0 border-b border-[#E6EAF3] bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search calls, contact, subject..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6FC] rounded-xl text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-indigo-200 transition-all border border-transparent focus:border-indigo-200"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                activeFilterCount > 0 ? "bg-indigo-100 text-indigo-600" : "text-muted-foreground hover:bg-gray-100"
              )}
            >
              <SlidersHorizontal size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">All conversations</p>
              <p className="text-[18px] font-semibold text-slate-900 mt-0.5">Customer Inbox</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold">{calls.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {calls.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pb-20 gap-3 text-muted-foreground px-8">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Search size={22} className="opacity-30" />
              </div>
              <p className="text-[13px] font-medium text-center">Keine Anrufe gefunden</p>
            </div>
          )}

          {calls.map((call) => {
            const isSelected = selectedCall?.id === call.id;
            return (
              <div
                key={call.id}
                onClick={() => onSelectCall(call)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectCall(call); }}
                className={cn(
                  "rounded-2xl border p-3.5 cursor-pointer transition-all",
                  isSelected
                    ? "bg-white border-indigo-200 shadow-sm shadow-indigo-100"
                    : "bg-white/70 border-transparent hover:bg-white hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-[13px] shrink-0"
                    style={{ backgroundColor: getAvatarColor(call.customerName) }}
                  >
                    {getInitials(call.customerName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[14px] truncate text-slate-900">{call.customerName}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{relativeTime(call.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="shrink-0">{statusIcon[call.status]}</span>
                      <span className="text-[12px] text-muted-foreground truncate flex-1">{call.subject}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-slate-500 truncate">{call.employeeAssigned}</span>
                      <span className="text-[11px] text-slate-500 tabular-nums">{formatDuration(call.duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FilterBar open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onApply={onFiltersChange} />
    </>
  );
}
