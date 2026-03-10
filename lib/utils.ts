import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);

  // Convert to CET (Europe/Berlin) — always show full date + 24h time
  const cetOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formatted = new Intl.DateTimeFormat("de-DE", cetOptions).format(date);
  // Result: "10.03.2026, 15:00"
  return formatted;
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
