"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera as CameraIcon, ArrowUpRight } from "lucide-react";

interface SpotCardProps {
  id: string;
  name: string;
  region: string;
  description: string;
  categories: string[];
  cover_photo: string | null;
}

export function SpotCard({
  id,
  name,
  region,
  description,
  categories,
  cover_photo,
}: SpotCardProps) {
  const truncatedDescription =
    description.length > 100
      ? description.slice(0, 100).trimEnd() + "..."
      : description;

  return (
    <Link href={`/spots/${id}`} className="group block">
      <article className="relative overflow-hidden rounded-xl border border-border/40 bg-card/40 transition-all duration-500 hover:border-primary/30 hover:bg-card/70 hover:shadow-2xl hover:shadow-primary/5">
        {/* Image area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {cover_photo ? (
            <Image
              src={cover_photo}
              alt={name}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <CameraIcon className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Region badge - top left */}
          <div className="absolute left-3 top-3">
            <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/90">
              <MapPin className="h-3 w-3 text-primary" />
              {region}
            </div>
          </div>

          {/* Arrow indicator - top right */}
          <div className="absolute right-3 top-3 rounded-full bg-primary/80 p-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
            <ArrowUpRight className="h-3.5 w-3.5 text-primary-foreground" />
          </div>

          {/* Title overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-xl font-bold leading-tight text-white drop-shadow-lg transition-colors group-hover:text-primary">
              {name}
            </h3>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 pt-3">
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {truncatedDescription}
          </p>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="border-border/50 bg-secondary/60 text-[11px] font-normal text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:text-foreground/80"
                >
                  {cat}
                </Badge>
              ))}
              {categories.length > 3 && (
                <Badge
                  variant="secondary"
                  className="border-border/50 bg-secondary/60 text-[11px] font-normal text-muted-foreground"
                >
                  +{categories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
