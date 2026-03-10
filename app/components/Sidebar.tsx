"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Phone,
  BookOpen,
  Users,
  UserCog,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

const menuItems: SidebarItem[] = [
  { label: "Analysen", icon: <BarChart3 size={20} />, href: "/analysen" },
  { label: "Anrufprotokoll", icon: <Phone size={20} />, href: "/anrufprotokoll", active: true },
  { label: "Wissensbasis", icon: <BookOpen size={20} />, href: "/wissensbasis" },
  { label: "Kunden", icon: <Users size={20} />, href: "/kunden" },
  { label: "Mitarbeiter", icon: <UserCog size={20} />, href: "/mitarbeiter" },
  { label: "Abonnement & Rechnungen", icon: <CreditCard size={20} />, href: "/abonnement" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-white shadow-md border border-border"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar border-r border-border z-50 flex flex-col",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-[260px]",
          "max-lg:translate-x-[-100%]",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Phone size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold text-primary">Kiki</span>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Phone size={16} className="text-white" />
            </div>
          )}

          <button
            onClick={() => {
              if (mobileOpen) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors max-lg:block hidden lg:block"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-sidebar-active text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className={cn("shrink-0", item.active && "text-primary")}>
                {item.icon}
              </span>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-3">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              collapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary">TM</span>
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium truncate">Thomas Müller</p>
                  <p className="text-xs text-muted-foreground truncate">Geschäftsführer</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
