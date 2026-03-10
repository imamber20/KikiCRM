"use client";

import {
  BarChart3,
  Phone,
  BookOpen,
  Users,
  UserCog,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  badge?: number;
  active?: boolean;
}

const topNav: NavItem[] = [
  { label: "Analysen",   icon: <BarChart3 size={20} /> },
  { label: "Anrufe",     icon: <Phone size={20} />,     active: true },
  { label: "Wissen",     icon: <BookOpen size={20} /> },
  { label: "Kunden",     icon: <Users size={20} /> },
  { label: "Mitarbeiter",icon: <UserCog size={20} /> },
  { label: "Abonnement", icon: <CreditCard size={20} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-[72px] bg-sidebar-bg h-full flex flex-col items-center pt-5 pb-4 shrink-0 gap-1">

      {/* Logo */}
      <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
        <Phone size={18} className="text-white" strokeWidth={2.5} />
      </div>

      {/* Top nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {topNav.map((item, i) => (
          <button
            key={i}
            title={item.label}
            className={cn(
              "relative w-full flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-150 gap-1",
              item.active
                ? "bg-white/10 text-white"
                : "text-white/35 hover:text-white/70 hover:bg-white/5"
            )}
          >
            {item.active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
            )}
            <span className={cn(item.active ? "text-primary" : "")}>
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold tracking-wide leading-none text-center">
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute top-1.5 right-2 bg-primary text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1 w-full px-2">
        <button
          title="Einstellungen"
          className="w-full flex flex-col items-center justify-center py-2.5 rounded-2xl text-white/35 hover:text-white/70 hover:bg-white/5 transition-colors gap-1"
        >
          <Settings size={20} />
          <span className="text-[9px] font-semibold tracking-wide">Einstellungen</span>
        </button>
        <button
          title="Abmelden"
          className="w-full flex flex-col items-center justify-center py-2.5 rounded-2xl text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors gap-1"
        >
          <LogOut size={18} />
          <span className="text-[9px] font-semibold tracking-wide">Abmelden</span>
        </button>
      </div>
    </aside>
  );
}
