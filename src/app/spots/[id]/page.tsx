import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Camera,
  Lightbulb,
  ExternalLink,
  Calendar,

} from "lucide-react";

interface Spot {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  best_time: string | null;
  equipment: string | null;
  photo_tips: string | null;
  categories: string[];
  photos: string[];
  cover_photo: string | null;
  created_at: string;
}

const BEST_TIME_LABELS: Record<string, string> = {
  morning: "Morgens / Goldene Stunde",
  midday: "Mittags",
  evening: "Abends / Blaue Stunde",
  night: "Nacht",
};

async function getSpot(id: string): Promise<Spot | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("fotospots")
      .select("*")
      .eq("id", id)
      .eq("is_approved", true)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const spot = await getSpot(id);

  if (!spot) {
    return { title: "Spot nicht gefunden – Nordlicht Fotospots" };
  }

  return {
    title: `${spot.name} – Nordlicht Fotospots`,
    description: spot.description.slice(0, 160),
  };
}

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = await getSpot(id);

  if (!spot) {
    notFound();
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`;
  const formattedDate = new Date(spot.created_at).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasPhotoInfo = spot.best_time || spot.equipment || spot.photo_tips;

  return (
    <div className="min-h-screen">
      {/* Back navigation */}
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
      </div>

      <article className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ==================== HEADER ==================== */}
        <header className="mb-10">
          {/* Meta info row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-primary">{spot.region}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {spot.name}
          </h1>

          {/* Categories */}
          {spot.categories && spot.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {spot.categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="border-border/50 bg-secondary/60 text-sm text-muted-foreground"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* ==================== PHOTO GALLERY ==================== */}
        {spot.photos && spot.photos.length > 0 && (
          <section className="mb-12">
            <PhotoGallery photos={spot.photos} spotName={spot.name} />
          </section>
        )}

        {/* ==================== CONTENT GRID ==================== */}
        <div className="grid gap-12 lg:grid-cols-[1fr,340px]">
          {/* Main content */}
          <div>
            {/* Description */}
            <section className="mb-10">
              <p className="text-lg leading-[1.8] text-foreground/85 whitespace-pre-line">
                {spot.description}
              </p>
            </section>

            {/* Divider */}
            <div className="mb-10 h-px bg-gradient-to-r from-border/60 via-border/30 to-transparent" />

            {/* Location card */}
            <section className="mb-10">
              <div className="overflow-hidden rounded-xl border border-border/40 bg-card/40">
                <div className="flex items-center gap-3 border-b border-border/30 px-5 py-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="font-display font-semibold">Standort</h2>
                </div>
                <div className="p-5">
                  <p className="mb-3 font-mono text-sm text-muted-foreground">
                    {spot.latitude.toFixed(4)}° N, {spot.longitude.toFixed(4)}° E
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    In Google Maps öffnen
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Photo tips */}
          {hasPhotoInfo && (
            <aside className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground/80">
                Foto-Informationen
              </h2>

              {spot.best_time && (
                <div className="overflow-hidden rounded-xl border border-border/40 bg-card/40 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">Beste Tageszeit</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {BEST_TIME_LABELS[spot.best_time] || spot.best_time}
                  </p>
                </div>
              )}

              {spot.equipment && (
                <div className="overflow-hidden rounded-xl border border-border/40 bg-card/40 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-accent/10 p-2">
                      <Camera className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">Ausrüstung</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {spot.equipment}
                  </p>
                </div>
              )}

              {spot.photo_tips && (
                <div className="overflow-hidden rounded-xl border border-border/40 bg-card/40 p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-semibold">Foto-Tipps</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {spot.photo_tips}
                  </p>
                </div>
              )}
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
