"use client";

import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";
import {
  Phone,
  PhoneForwarded,
  PhoneMissed,
  PhoneIncoming,
  Clock,
  User,
} from "lucide-react";
import { Call } from "@/lib/dummyCalls";
import { formatDuration, cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { de } from "date-fns/locale";

interface CallCardProps {
  call: Call;
  onClick: () => void;
  index: number;
}

const statusConfig = {
  erfolgreich: {
    label: "Erfolgreich",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <PhoneIncoming size={14} />,
    dot: "bg-emerald-500",
  },
  nicht_erfolgreich: {
    label: "Nicht erfolgreich",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <PhoneMissed size={14} />,
    dot: "bg-red-500",
  },
  weitergeleitet: {
    label: "Weitergeleitet",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <PhoneForwarded size={14} />,
    dot: "bg-amber-500",
  },
};

function formatTimestamp(date: Date): string {
  if (isToday(date)) return `Heute, ${format(date, "HH:mm")}`;
  if (isYesterday(date)) return `Gestern, ${format(date, "HH:mm")}`;
  return format(date, "dd. MMM yyyy, HH:mm", { locale: de });
}

export default function CallCard({ call, onClick, index }: CallCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const config = statusConfig[call.status];

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (e.dir === "Left") {
        setSwipeOffset(Math.min(e.absX, 120));
      }
    },
    onSwipedLeft: () => {
      if (swipeOffset > 60) {
        // trigger callback action
        window.location.href = `tel:${call.customerPhone}`;
      }
      setSwipeOffset(0);
    },
    onTouchEndOrOnMouseUp: () => setSwipeOffset(0),
    trackMouse: false,
    trackTouch: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="relative overflow-hidden"
    >
      {/* Swipe action behind */}
      <div
        className="absolute inset-y-0 right-0 w-[120px] bg-primary flex items-center justify-center rounded-2xl"
        style={{ opacity: swipeOffset / 120 }}
      >
        <div className="text-white text-center">
          <Phone size={20} className="mx-auto mb-1" />
          <span className="text-xs font-medium">Rückruf</span>
        </div>
      </div>

      {/* Card */}
      <div
        {...handlers}
        onClick={onClick}
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        className={cn(
          "relative bg-card rounded-2xl border border-border p-4 cursor-pointer",
          "hover:shadow-md hover:border-primary/20 transition-all duration-200",
          "active:scale-[0.99]"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: avatar + info */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">
                  {call.customerName}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                    config.color
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                  {config.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {call.subject}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimestamp(call.timestamp)}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {formatDuration(call.duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: employee */}
          <div className="text-right shrink-0 hidden sm:block">
            <p className="text-xs text-muted-foreground">{call.employeeAssigned}</p>
            <p className="text-xs text-muted-foreground mt-1">{call.customerPhone}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
