import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Spot einreichen – Nordlicht Fotospots",
  description:
    "Teile deinen Lieblings-Fotospot in Norddeutschland mit der Community. Kein Account nötig.",
};

export default function EinreichenPage() {
  return (
    <div className="min-h-screen">
      {/* Page header with ambient background */}
      <div className="relative overflow-hidden border-b border-border/20">
        {/* Ambient glow */}
        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[80px]" />

        <div className="relative mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/5 p-2">
              <Camera className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Spot einreichen
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Teile deinen Lieblings-Fotospot mit der Community.
            Kein Account nötig — einfach ausfüllen und absenden.
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <SubmitForm />
      </div>
    </div>
  );
}
