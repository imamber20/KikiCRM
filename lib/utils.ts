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
  const now = new Date("2026-03-10T14:00:00.000Z");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${mins}`;

  if (diffHours < 24) return `Heute, ${time}`;
  if (diffHours < 48) return `Gestern, ${time}`;

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.getMonth() + 1;
  const monthNames = ["", "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  return `${day}. ${monthNames[month]} ${date.getFullYear()}, ${time}`;
}

export function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
