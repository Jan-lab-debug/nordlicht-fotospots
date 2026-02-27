import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

export default function SpotNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="rounded-2xl bg-secondary/50 p-8">
          <MapPin className="h-16 w-16 text-muted-foreground/30" />
        </div>
        <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-xl" />
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold">Spot nicht gefunden</h1>
      <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
        Dieser Fotospot existiert nicht oder wurde entfernt.
      </p>
      <Button asChild className="gap-2 font-display font-semibold bg-primary hover:bg-primary/90">
        <Link href="/">
          Zurück zur Übersicht
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
