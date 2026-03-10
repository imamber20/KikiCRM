"use client";

import {
  BarChart3,
  Phone,
  BookOpen,
  Users,
  UserCog,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const topItems: SidebarItem[] = [
  { label: "Analysen", icon: <BarChart3 size={20} /> },
  { label: "Anrufprotokoll", icon: <Phone size={20} />, active: true },
  { label: "Wissensbasis", icon: <BookOpen size={20} /> },
  { label: "Kunden", icon: <Users size={20} /> },
  { label: "Mitarbeiter", icon: <UserCog size={20} /> },
  { label: "Abonnement & Rechnungen", icon: <CreditCard size={20} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-[60px] bg-sidebar-bg h-full flex flex-col items-center py-5 shrink-0">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-8">
        <Phone size={20} className="text-white" />
      </div>

      {/* Nav icons */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {topItems.map((item, i) => (
          <button
            key={i}
            title={item.label}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group",
              item.active
                ? "bg-primary text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            )}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom: help */}
      <div className="flex flex-col items-center">
        <button
          title="Hilfe"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </aside>
  );
}
