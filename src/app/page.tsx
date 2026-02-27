import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SpotCard } from "@/components/SpotCard";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Camera, Plus, ArrowDown, Aperture, Mountain } from "lucide-react";

interface Spot {
  id: string;
  name: string;
  region: string;
  description: string;
  categories: string[];
  cover_photo: string | null;
}

async function getSpots(): Promise<Spot[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("fotospots")
      .select("id, name, region, description, categories, cover_photo")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching spots:", error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const spots = await getSpots();

  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

        {/* Ambient light effects */}
        <div className="absolute inset-0">
          {/* Warm amber glow - top right */}
          <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/6 blur-[120px]" />
          {/* Misty blue glow - bottom left */}
          <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-accent/8 blur-[100px]" />
          {/* Subtle center glow */}
          <div className="absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/3 blur-[150px]" />
        </div>

        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-6 animate-fade-in-down flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-display text-xs font-medium tracking-widest uppercase text-primary">
                  Norddeutschland
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="mb-6 animate-fade-in-up font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block text-foreground">Die schönsten</span>
              <span className="block text-gradient">Fotospots</span>
              <span className="block text-foreground">entdecken.</span>
            </h1>

            {/* Subheadline */}
            <p className="mb-10 animate-fade-in-up animation-delay-200 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Atemberaubende Locations an rauen Küsten, in mystischen
              Wäldern und weiten Landschaften. Geteilt von Fotografen,
              für Fotografen.
            </p>

            {/* CTA buttons */}
            <div className="flex animate-fade-in-up animation-delay-300 flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group gap-2.5 font-display text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02] h-13 px-8"
              >
                <Link href="/einreichen">
                  <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
                  Spot einreichen
                </Link>
              </Button>
              {spots.length > 0 && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group gap-2.5 font-display text-base border-border/60 bg-transparent hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 h-13 px-8"
                >
                  <a href="#spots">
                    <Aperture className="h-5 w-5 text-primary transition-transform group-hover:rotate-45 duration-500" />
                    {spots.length} Spot{spots.length !== 1 ? "s" : ""} entdecken
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Stats / social proof */}
          {spots.length > 0 && (
            <div className="mt-20 animate-fade-in animation-delay-500 flex items-center gap-8 border-t border-border/20 pt-8">
              <div>
                <div className="font-display text-3xl font-bold text-foreground">{spots.length}</div>
                <div className="text-xs text-muted-foreground tracking-wide uppercase">Fotospots</div>
              </div>
              <div className="h-8 w-px bg-border/30" />
              <div>
                <div className="font-display text-3xl font-bold text-foreground">5</div>
                <div className="text-xs text-muted-foreground tracking-wide uppercase">Regionen</div>
              </div>
              <div className="h-8 w-px bg-border/30" />
              <div>
                <div className="font-display text-3xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground tracking-wide uppercase">Community</div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        {spots.length > 0 && (
          <a
            href="#spots"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 transition-colors hover:text-primary animate-fade-in animation-delay-500"
          >
            <span className="text-[10px] tracking-widest uppercase">Entdecken</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        )}
      </section>

      {/* ==================== SPOT GRID ==================== */}
      <section id="spots" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Section top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {spots.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-8 relative">
              <div className="rounded-2xl bg-secondary/50 p-8">
                <Mountain className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-xl" />
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold">
              Noch keine Fotospots
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
              Sei der Erste, der einen atemberaubenden Fotospot in
              Norddeutschland mit der Community teilt.
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 font-display font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Link href="/einreichen">
                <Plus className="h-5 w-5" />
                Ersten Spot einreichen
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Section header */}
            <div className="mb-12">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Aktuelle Fotospots
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {spots.length} Spot{spots.length !== 1 ? "s" : ""} von der Community entdeckt
                  </p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden gap-2 text-sm text-muted-foreground hover:text-primary sm:flex"
                >
                  <Link href="/einreichen">
                    <Plus className="h-4 w-4" />
                    Spot hinzufügen
                  </Link>
                </Button>
              </div>
              {/* Accent line below heading */}
              <div className="mt-4 h-px w-24 bg-gradient-to-r from-primary to-transparent" />
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {spots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  id={spot.id}
                  name={spot.name}
                  region={spot.region}
                  description={spot.description}
                  categories={spot.categories || []}
                  cover_photo={spot.cover_photo}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
            Kennst du einen <span className="text-gradient">geheimen Spot</span>?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            Teile deine Lieblings-Fotolocation mit der Community.
            Kein Account nötig, einfach einreichen.
          </p>
          <Button
            asChild
            size="lg"
            className="gap-2.5 font-display text-base font-semibold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 h-13 px-8"
          >
            <Link href="/einreichen">
              <Camera className="h-5 w-5" />
              Spot einreichen
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
