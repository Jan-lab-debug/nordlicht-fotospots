import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Spot einreichen – Nordlicht Fotospots",
  description:
    "Teile deinen Lieblings-Fotospot in Norddeutschland mit der Community. Kein Account nötig.",
};

export default function EinreichenPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Fotospot einreichen
        </h1>
        <p className="text-lg text-muted-foreground">
          Teile deinen Lieblings-Fotospot mit der Community. Kein Account nötig
          – einfach ausfüllen und absenden.
        </p>
      </div>
      <SubmitForm />
    </div>
  );
}
