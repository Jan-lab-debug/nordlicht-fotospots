import Link from "next/link";
import { Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/30">
      {/* Subtle gradient glow at top */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-lg font-display font-bold tracking-tight text-foreground/80 transition-colors hover:text-primary"
          >
            <Camera className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
            Nordlicht Fotospots
          </Link>

          {/* Tagline */}
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Die schönsten Fotospots in Norddeutschland, geteilt von
            Fotografen für Fotografen. Entdecke atemberaubende Locations
            an Küsten, in Wäldern und auf dem Land.
          </p>

          {/* Nav links */}
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Fotospots
            </Link>
            <span className="h-3 w-px bg-border" />
            <Link
              href="/einreichen"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Spot einreichen
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Nordlicht Fotospots.
            Mit Liebe aus Norddeutschland.
          </div>
        </div>
      </div>
    </footer>
  );
}
