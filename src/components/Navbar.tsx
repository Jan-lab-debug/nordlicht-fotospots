import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <Camera className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Nordlicht Fotospots</span>
          <span className="sm:hidden">Nordlicht</span>
        </Link>
        <Button asChild size="sm" className="gap-1.5 font-semibold">
          <Link href="/einreichen">
            <Plus className="h-4 w-4" />
            Spot einreichen
          </Link>
        </Button>
      </div>
    </nav>
  );
}
