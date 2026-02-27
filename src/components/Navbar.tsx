import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Plus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Subtle glow line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-foreground transition-all hover:text-primary"
          >
            <div className="relative">
              <Camera className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -inset-1 rounded-full bg-primary/10 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
            </div>
            <span className="hidden sm:inline">Nordlicht Fotospots</span>
            <span className="sm:hidden">Nordlicht</span>
          </Link>

          <Button
            asChild
            size="sm"
            className="gap-1.5 font-display font-semibold bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02]"
          >
            <Link href="/einreichen">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Spot einreichen</span>
              <span className="sm:hidden">Einreichen</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
