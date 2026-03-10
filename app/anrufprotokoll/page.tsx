"use client";

import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import CallListPanel from "../components/CallListPanel";
import ConversationPanel from "../components/ConversationPanel";
import DetailProfilePanel from "../components/DetailProfilePanel";
import { Call, dummyCalls } from "@/lib/dummyCalls";
import { FilterState, defaultFilters } from "../components/FilterBar";

function applyFilters(calls: Call[], filters: FilterState, search: string): Call[] {
  let filtered = [...calls];

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

  const now = new Date("2026-03-10T14:00:00.000Z");
  if (filters.timePeriod === "24h") {
    filtered = filtered.filter((c) => now.getTime() - new Date(c.timestamp).getTime() <= 24 * 60 * 60 * 1000);
  } else if (filters.timePeriod === "7d") {
    filtered = filtered.filter((c) => now.getTime() - new Date(c.timestamp).getTime() <= 7 * 24 * 60 * 60 * 1000);
  } else if (filters.timePeriod === "30d") {
    filtered = filtered.filter((c) => now.getTime() - new Date(c.timestamp).getTime() <= 30 * 24 * 60 * 60 * 1000);
  }

  if (filters.status.length > 0) {
    filtered = filtered.filter((c) => filters.status.includes(c.status));
  }
  if (filters.employee) {
    filtered = filtered.filter((c) => c.employeeAssigned === filters.employee);
  }
  if (filters.keyword.trim()) {
    const kw = filters.keyword.toLowerCase();
    filtered = filtered.filter(
      (c) => c.subject.toLowerCase().includes(kw) || c.summary.toLowerCase().includes(kw)
    );
  }
  if (filters.phone.trim()) {
    filtered = filtered.filter((c) => c.customerPhone.includes(filters.phone.trim()));
  }
  if (filters.minDuration) {
    filtered = filtered.filter((c) => c.duration >= parseInt(filters.minDuration) * 60);
  }
  if (filters.maxDuration) {
    filtered = filtered.filter((c) => c.duration <= parseInt(filters.maxDuration) * 60);
  }
  if (filters.topic) {
    filtered = filtered.filter((c) => c.topic === filters.topic);
  }

  return filtered;
}

export default function AnrufprotokollPage() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredCalls = useMemo(
    () => applyFilters(dummyCalls, filters, search),
    [filters, search]
  );

  const handleSelectCall = (call: Call) => {
    setSelectedCall(call);
    setShowProfile(false); // close profile when selecting new call
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Icon sidebar */}
      <Sidebar />

      {/* Call list panel */}
      <CallListPanel
        calls={filteredCalls}
        selectedCall={selectedCall}
        onSelectCall={handleSelectCall}
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Center conversation panel */}
      <ConversationPanel
        call={selectedCall}
        onNameClick={handleShowProfile}
      />

      {/* Right detail profile panel (only when name is clicked) */}
      {showProfile && selectedCall && (
        <DetailProfilePanel
          call={selectedCall}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
}
