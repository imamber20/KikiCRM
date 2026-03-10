"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  Phone,
  PhoneForwarded,
  Copy,
  Download,
  Forward,
  PhoneCall,
  ExternalLink,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { formatDuration, cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import CustomerCard from "./CustomerCard";
import AudioPlayerWithTranscript from "./AudioPlayerWithTranscript";
import { exportCallToPDF, exportSingleCallToCSV } from "@/lib/exportUtils";

interface CallDetailModalProps {
  call: Call | null;
  onClose: () => void;
}

const statusConfig = {
  erfolgreich: {
    label: "Erfolgreich",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  nicht_erfolgreich: {
    label: "Nicht erfolgreich",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  weitergeleitet: {
    label: "Weitergeleitet",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
};

export default function CallDetailModal({ call, onClose }: CallDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");
  const [copied, setCopied] = useState(false);

  if (!call) return null;

  const config = statusConfig[call.status];

  const copySummary = async () => {
    const text = `${call.subject}\n\n${call.summaryBullets.map((b) => `• ${b}`).join("\n")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {call && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 md:inset-x-auto md:inset-y-8 md:max-w-2xl md:mx-auto bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-lg font-bold truncate">{call.subject}</h2>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0",
                      config.color
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {format(call.timestamp, "dd. MMM yyyy, HH:mm", { locale: de })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} />
                    {formatDuration(call.duration)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0 ml-3"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-3 flex gap-1 bg-white">
              <button
                onClick={() => setActiveTab("summary")}
                className={cn(
                  "px-4 py-2 rounded-t-xl text-sm font-medium transition-colors relative",
                  activeTab === "summary"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Zusammenfassung
                {activeTab === "summary" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("transcript")}
                className={cn(
                  "px-4 py-2 rounded-t-xl text-sm font-medium transition-colors relative",
                  activeTab === "transcript"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Vollständiges Gespräch
                {activeTab === "transcript" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            </div>
            <div className="h-px bg-border" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                {activeTab === "summary" ? (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Customer card */}
                    <CustomerCard call={call} />

                    {/* Summary */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3">Zusammenfassung</h3>
                      <ul className="space-y-2">
                        {call.summaryBullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assigned employee */}
                    <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3 border border-border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <PhoneForwarded size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Zugewiesen an</p>
                        <p className="text-sm font-medium">{call.employeeAssigned}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={copySummary}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? "Kopiert!" : "Zusammenfassung kopieren"}
                      </button>
                      <a
                        href={call.audioUrl}
                        download
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
                      >
                        <Download size={14} />
                        Audio herunterladen
                      </a>
                      <button className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
                        <Forward size={14} />
                        An Mitarbeiter weiterleiten
                      </button>
                      <a
                        href={`tel:${call.customerPhone}`}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                      >
                        <PhoneCall size={14} />
                        Rückruf
                      </a>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                      <ExternalLink size={14} />
                      Vollständiges Kundenprofil öffnen
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="transcript"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AudioPlayerWithTranscript
                      audioUrl={call.audioUrl}
                      transcript={call.transcript}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with export */}
            <div className="border-t border-border px-6 py-3 flex items-center gap-2 bg-white">
              <button
                onClick={() => exportCallToPDF(call)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <FileText size={14} />
                Export PDF
              </button>
              <button
                onClick={() => exportSingleCallToCSV(call)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <FileSpreadsheet size={14} />
                Export CSV
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setActiveTab("transcript")}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  activeTab === "summary"
                    ? "text-primary hover:bg-primary/5"
                    : "text-muted-foreground"
                )}
              >
                Vollständiges Gespräch ansehen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
