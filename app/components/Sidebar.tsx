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
  { label: "Analysen", icon: <BarChart3 size={18} /> },
  { label: "Anrufe", icon: <Phone size={18} />, active: true, badge: 6 },
  { label: "Wissen", icon: <BookOpen size={18} /> },
  { label: "Kunden", icon: <Users size={18} /> },
  { label: "Mitarbeiter", icon: <UserCog size={18} /> },
  { label: "Abonnement", icon: <CreditCard size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="w-[84px] bg-[#14161D] h-full flex flex-col items-center pt-6 pb-4 shrink-0 gap-1 border-r border-white/10">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-7 shadow-lg shadow-indigo-500/20">
        <Phone size={18} className="text-white" strokeWidth={2.6} />
      </div>

      <nav className="flex-1 flex flex-col items-center gap-1.5 w-full px-2.5">
        {topNav.map((item, i) => (
          <button
            key={i}
            title={item.label}
            className={cn(
              "relative w-full flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-150 gap-1",
              item.active
                ? "bg-white/12 text-white"
                : "text-white/40 hover:text-white/80 hover:bg-white/6"
            )}
          >
            {item.active && (
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-indigo-400" />
            )}
            <span className={cn(item.active ? "text-indigo-300" : "")}>{item.icon}</span>
            <span className="text-[9px] font-medium leading-none text-center">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1.5 w-full px-2.5">
        <button
          title="Einstellungen"
          className="w-full flex flex-col items-center justify-center py-2.5 rounded-2xl text-white/45 hover:text-white/80 hover:bg-white/6 transition-colors gap-1"
        >
          <Settings size={18} />
          <span className="text-[9px] font-medium tracking-wide">Settings</span>
        </button>
        <button
          title="Abmelden"
          className="w-full flex flex-col items-center justify-center py-2.5 rounded-2xl text-white/30 hover:text-red-300 hover:bg-red-500/10 transition-colors gap-1"
        >
          <LogOut size={17} />
          <span className="text-[9px] font-medium tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
