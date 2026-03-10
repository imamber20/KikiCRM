import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Kiki CRM – Anrufprotokoll",
  description: "Intelligentes Anrufmanagement für Handwerksbetriebe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased bg-background font-sans">
        <Sidebar />
        <main className="lg:pl-[260px] min-h-screen transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
