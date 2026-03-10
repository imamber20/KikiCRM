"use client";

import {
  BarChart3,
  Phone,
  BookOpen,
  Users,
  UserCog,
  CreditCard,
  HelpCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const topItems: SidebarItem[] = [
  { label: "Analysen", icon: <BarChart3 size={19} /> },
  { label: "Anrufprotokoll", icon: <Phone size={19} />, active: true },
  { label: "Wissensbasis", icon: <BookOpen size={19} /> },
  { label: "Kunden", icon: <Users size={19} /> },
  { label: "Mitarbeiter", icon: <UserCog size={19} /> },
  { label: "Abonnement & Rechnungen", icon: <CreditCard size={19} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-[60px] bg-sidebar-bg h-full flex flex-col items-center py-4 shrink-0">

      {/* Logo mark */}
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/30">
        <Phone size={17} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-1.5 w-full px-2">
        {topItems.map((item, i) => (
          <button
            key={i}
            title={item.label}
            className={cn(
              "w-full h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative group",
              item.active
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-slate-400 hover:text-white hover:bg-slate-700/70"
            )}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-[calc(100%+8px)] px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
              {item.label}
              {/* Tooltip arrow */}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom buttons */}
      <div className="flex flex-col items-center gap-1.5 w-full px-2">
        <button
          title="Einstellungen"
          className="w-full h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors relative group"
        >
          <Settings size={19} />
          <span className="absolute left-[calc(100%+8px)] px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
            Einstellungen
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </span>
        </button>
        <button
          title="Hilfe"
          className="w-full h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/70 transition-colors relative group"
        >
          <HelpCircle size={19} />
          <span className="absolute left-[calc(100%+8px)] px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
            Hilfe
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </span>
        </button>
      </div>
    </aside>
  );
}
