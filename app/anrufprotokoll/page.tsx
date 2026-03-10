"use client";

import { Phone } from "lucide-react";
import CallList from "../components/CallList";

export default function AnrufprotokollPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {/* Spacer for mobile menu button */}
            <div className="w-10 lg:hidden" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone size={18} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Anrufprotokoll</h1>
                <p className="text-xs text-muted-foreground">
                  Alle eingehenden und ausgehenden Anrufe
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        <CallList />
      </div>
    </div>
  );
}
