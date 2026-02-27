import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
        </Button>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {spot.region}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {spot.name}
          </h1>
          {spot.categories && spot.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {spot.categories.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Photo Gallery */}
        {spot.photos && spot.photos.length > 0 && (
          <section className="mb-10">
            <PhotoGallery photos={spot.photos} spotName={spot.name} />
          </section>
        )}

        {/* Description */}
        <section className="mb-10">
          <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
            {spot.description}
          </p>
        </section>

        <Separator className="mb-10" />

        {/* Info Grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {/* GPS Coordinates */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">GPS-Koordinaten</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  {spot.latitude.toFixed(4)}° N, {spot.longitude.toFixed(4)}° E
                </p>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  In Google Maps öffnen
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Best Time */}
          {spot.best_time && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-lg bg-accent/10 p-2.5">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Beste Tageszeit</h3>
                  <p className="text-sm text-muted-foreground">
                    {BEST_TIME_LABELS[spot.best_time] || spot.best_time}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipment */}
          {spot.equipment && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Empfohlene Ausrüstung</h3>
                  <p className="text-sm text-muted-foreground">
                    {spot.equipment}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Tips */}
          {spot.photo_tips && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-lg bg-accent/10 p-2.5">
                  <Lightbulb className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Foto-Tipps</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {spot.photo_tips}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </article>
    </div>
  );
}
