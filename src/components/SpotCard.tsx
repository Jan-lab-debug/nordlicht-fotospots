"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Camera as CameraIcon } from "lucide-react";

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
    description.length > 120
      ? description.slice(0, 120).trimEnd() + "..."
      : description;

  return (
    <Link href={`/spots/${id}`} className="group block">
      <Card className="overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {cover_photo ? (
            <Image
              src={cover_photo}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <CameraIcon className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sm text-white/90">
            <MapPin className="h-3.5 w-3.5" />
            {region}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1.5 text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
            {truncatedDescription}
          </p>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {cat}
                </Badge>
              ))}
              {categories.length > 3 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  +{categories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

