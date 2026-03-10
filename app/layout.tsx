import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
