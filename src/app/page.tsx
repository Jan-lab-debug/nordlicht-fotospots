import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SpotCard } from "@/components/SpotCard";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Camera, Plus, MapPin } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30">
        {/* Gradient background simulating dramatic northern landscape */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Norddeutschland
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Die schönsten{" "}
              <span className="text-primary">Fotospots</span>{" "}
              entdecken
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Entdecke atemberaubende Foto-Locations an Küsten, in Wäldern und
              auf dem Land. Geteilt von Fotografen für Fotografen.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2 text-base font-semibold">
                <Link href="/einreichen">
                  <Plus className="h-5 w-5" />
                  Spot einreichen
                </Link>
              </Button>
              {spots.length > 0 && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 text-base"
                >
                  <a href="#spots">
                    <Camera className="h-5 w-5" />
                    {spots.length} Spot{spots.length !== 1 ? "s" : ""} entdecken
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Spot Grid */}
      <section id="spots" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {spots.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-6 rounded-full bg-muted p-6">
              <Camera className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">
              Noch keine Fotospots vorhanden
            </h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              Sei der Erste, der einen atemberaubenden Fotospot in
              Norddeutschland teilt!
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/einreichen">
                <Plus className="h-5 w-5" />
                Ersten Spot einreichen
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Aktuelle Fotospots
              </h2>
              <p className="mt-1 text-muted-foreground">
                {spots.length} Spot{spots.length !== 1 ? "s" : ""} von der Community
              </p>
            </div>
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
    </div>
  );
}
