"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  timePeriod: string;
  status: string[];
  employee: string;
  keyword: string;
  phone: string;
  minDuration: string;
  maxDuration: string;
  topic: string;
}

const defaultFilters: FilterState = {
  timePeriod: "all",
  status: [],
  employee: "",
  keyword: "",
  phone: "",
  minDuration: "",
  maxDuration: "",
  topic: "",
};

const timePeriods = [
  { value: "24h", label: "Letzte 24 Stunden" },
  { value: "7d", label: "Letzte 7 Tage" },
  { value: "30d", label: "Letzter Monat" },
  { value: "all", label: "Alle" },
];

const statuses = [
  { value: "erfolgreich", label: "Erfolgreich" },
  { value: "nicht_erfolgreich", label: "Nicht erfolgreich" },
  { value: "weitergeleitet", label: "Weitergeleitet" },
];

const employees = [
  "Thomas Müller",
  "Hans Weber",
  "Klaus Schmidt",
  "Maria Fischer",
  "Anna Wagner",
];

const topics = [
  "Sanitär",
  "Elektrik",
  "Schreinerei",
  "Heizung",
  "Dachdecker",
  "Malerei",
  "Fliesenleger",
  "Gartenbau",
];

interface FilterBarProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

export default function FilterBar({ open, onClose, filters, onApply }: FilterBarProps) {
  const [local, setLocal] = useState<FilterState>(filters);

  const handleReset = () => {
    setLocal(defaultFilters);
    onApply(defaultFilters);
    onClose();
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const toggleStatus = (s: string) => {
    setLocal((prev) => ({
      ...prev,
      status: prev.status.includes(s)
        ? prev.status.filter((v) => v !== s)
        : [...prev.status, s],
    }));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                <h2 className="text-lg font-semibold">Filter</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Time period */}
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
                  <Calendar size={14} />
                  Zeitraum
                </label>
                <div className="flex flex-wrap gap-2">
                  {timePeriods.map((tp) => (
                    <button
                      key={tp.value}
                      onClick={() => setLocal((p) => ({ ...p, timePeriod: tp.value }))}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                        local.timePeriod === tp.value
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-muted-foreground border-border hover:border-primary/30"
                      )}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => toggleStatus(s.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                        local.status.includes(s.value)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-muted-foreground border-border hover:border-primary/30"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Employee */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mitarbeiter
                </label>
                <select
                  value={local.employee}
                  onChange={(e) => setLocal((p) => ({ ...p, employee: e.target.value }))}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Alle Mitarbeiter</option>
                  {employees.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Thema
                </label>
                <select
                  value={local.topic}
                  onChange={(e) => setLocal((p) => ({ ...p, topic: e.target.value }))}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Alle Themen</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Keyword */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Stichwort
                </label>
                <input
                  type="text"
                  value={local.keyword}
                  onChange={(e) => setLocal((p) => ({ ...p, keyword: e.target.value }))}
                  placeholder="z.B. Heizung, Wasserhahn..."
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Telefonnummer
                </label>
                <input
                  type="text"
                  value={local.phone}
                  onChange={(e) => setLocal((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+49..."
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Duration range */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Anrufdauer (Minuten)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={local.minDuration}
                    onChange={(e) => setLocal((p) => ({ ...p, minDuration: e.target.value }))}
                    placeholder="Min"
                    min={0}
                    className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-muted-foreground text-sm">bis</span>
                  <input
                    type="number"
                    value={local.maxDuration}
                    onChange={(e) => setLocal((p) => ({ ...p, maxDuration: e.target.value }))}
                    placeholder="Max"
                    min={0}
                    className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Zurücksetzen
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Anwenden
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export { defaultFilters };
