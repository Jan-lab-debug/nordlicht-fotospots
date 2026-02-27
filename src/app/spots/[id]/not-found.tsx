import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function SpotNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-muted p-6">
        <MapPin className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Spot nicht gefunden</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Dieser Fotospot existiert nicht oder wurde entfernt.
      </p>
      <Button asChild>
        <Link href="/">Zurück zur Übersicht</Link>
      </Button>
    </div>
  );
}
