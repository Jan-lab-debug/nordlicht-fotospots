import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Nordlicht Fotospots – Die schönsten Fotospots in Norddeutschland",
  description:
    "Entdecke und teile die besten Foto-Locations in Norddeutschland. Tipps zu Licht, Tageszeit und Ausrüstung von der Community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="antialiased min-h-screen bg-background">
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
