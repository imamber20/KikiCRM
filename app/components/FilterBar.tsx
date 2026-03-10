"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocal(filters);
    }
  }, [filters, open]);

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

  const sectionClassName = "rounded-2xl border border-border bg-gray-50/60 p-4 space-y-3";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-[1px] z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 270 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-border"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={18} className="text-primary" />
                <h2 className="text-lg font-semibold tracking-tight">Filter</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Filter schließen"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar size={13} />
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
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
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
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-muted-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
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

              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
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

              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Stichwort
                </label>
                <input
                  type="text"
                  value={local.keyword}
                  onChange={(e) => setLocal((p) => ({ ...p, keyword: e.target.value }))}
                  placeholder="z.B. Heizung, Wasserhahn..."
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                />
              </div>

              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Telefonnummer
                </label>
                <input
                  type="text"
                  value={local.phone}
                  onChange={(e) => setLocal((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+49..."
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                />
              </div>

              <div className={sectionClassName}>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                  Anrufdauer (Minuten)
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="number"
                    value={local.minDuration}
                    onChange={(e) => setLocal((p) => ({ ...p, minDuration: e.target.value }))}
                    placeholder="Min"
                    min={0}
                    className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  />
                  <span className="text-muted-foreground text-sm">bis</span>
                  <input
                    type="number"
                    value={local.maxDuration}
                    onChange={(e) => setLocal((p) => ({ ...p, maxDuration: e.target.value }))}
                    placeholder="Max"
                    min={0}
                    className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border px-5 py-4 flex gap-3 bg-white/95 backdrop-blur shrink-0">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Zurücksetzen
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
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
