"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, FileSpreadsheet, Loader2 } from "lucide-react";
import { Call, dummyCalls } from "@/lib/dummyCalls";
import { cn } from "@/lib/utils";
import CallCard from "./CallCard";
import CallDetailModal from "./CallDetailModal";
import FilterBar, { FilterState, defaultFilters } from "./FilterBar";
import { exportCallsToCSV } from "@/lib/exportUtils";

function applyFilters(calls: Call[], filters: FilterState, search: string): Call[] {
  let filtered = [...calls];

  // Search
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.customerPhone.includes(q) ||
        c.employeeAssigned.toLowerCase().includes(q)
    );
  }

  // Time period
  const now = new Date();
  if (filters.timePeriod === "24h") {
    filtered = filtered.filter(
      (c) => now.getTime() - c.timestamp.getTime() <= 24 * 60 * 60 * 1000
    );
  } else if (filters.timePeriod === "7d") {
    filtered = filtered.filter(
      (c) => now.getTime() - c.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000
    );
  } else if (filters.timePeriod === "30d") {
    filtered = filtered.filter(
      (c) => now.getTime() - c.timestamp.getTime() <= 30 * 24 * 60 * 60 * 1000
    );
  }

  // Status
  if (filters.status.length > 0) {
    filtered = filtered.filter((c) => filters.status.includes(c.status));
  }

  // Employee
  if (filters.employee) {
    filtered = filtered.filter((c) => c.employeeAssigned === filters.employee);
  }

  // Keyword
  if (filters.keyword.trim()) {
    const kw = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.subject.toLowerCase().includes(kw) ||
        c.summary.toLowerCase().includes(kw) ||
        c.transcript.some((l) => l.text.toLowerCase().includes(kw))
    );
  }

  // Phone
  if (filters.phone.trim()) {
    filtered = filtered.filter((c) => c.customerPhone.includes(filters.phone.trim()));
  }

  // Duration
  if (filters.minDuration) {
    const minSec = parseInt(filters.minDuration) * 60;
    filtered = filtered.filter((c) => c.duration >= minSec);
  }
  if (filters.maxDuration) {
    const maxSec = parseInt(filters.maxDuration) * 60;
    filtered = filtered.filter((c) => c.duration <= maxSec);
  }

  // Topic
  if (filters.topic) {
    filtered = filtered.filter((c) => c.topic === filters.topic);
  }

  return filtered;
}

export default function CallList() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isLoading] = useState(false);

  const filteredCalls = useMemo(
    () => applyFilters(dummyCalls, filters, search),
    [filters, search]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.timePeriod !== "all") count++;
    if (filters.status.length > 0) count++;
    if (filters.employee) count++;
    if (filters.keyword) count++;
    if (filters.phone) count++;
    if (filters.minDuration || filters.maxDuration) count++;
    if (filters.topic) count++;
    return count;
  }, [filters]);

  return (
    <>
      {/* Search & filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Name, Betreff, Telefonnummer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shrink-0",
            activeFilterCount > 0
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:bg-muted text-muted-foreground"
          )}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filter</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={() => exportCallsToCSV(filteredCalls)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all text-muted-foreground shrink-0"
        >
          <FileSpreadsheet size={15} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {filteredCalls.length} {filteredCalls.length === 1 ? "Anruf" : "Anrufe"}
        </p>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      )}

      {/* Call list */}
      {!isLoading && filteredCalls.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Keine Anrufe gefunden. Versuchen Sie andere Suchkriterien.
          </p>
        </div>
      )}

      {!isLoading && filteredCalls.length > 0 && (
        <div className="space-y-2">
          {filteredCalls.map((call, index) => (
            <CallCard
              key={call.id}
              call={call}
              onClick={() => setSelectedCall(call)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Filter sidebar */}
      <FilterBar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      {/* Detail modal */}
      <CallDetailModal
        call={selectedCall}
        onClose={() => setSelectedCall(null)}
      />
    </>
  );
}
