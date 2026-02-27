"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Expand } from "lucide-react";

interface PhotoGalleryProps {
  photos: string[];
  spotName: string;
}

export function PhotoGallery({ photos, spotName }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const slides = photos.map((url) => ({ src: url }));

  return (
    <div>
      {/* Main photo */}
      <button
        type="button"
        onClick={() => {
          setLightboxIndex(0);
          setLightboxOpen(true);
        }}
        className="group relative mb-3 aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={photos[0]}
          alt={`${spotName} - Hauptfoto`}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, 900px"
          priority
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
        <div className="absolute bottom-4 right-4 rounded-full bg-black/40 p-2.5 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <Expand className="h-4 w-4 text-white" />
        </div>
      </button>

      {/* Thumbnail row */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((url, idx) => (
            <button
              key={url}
              type="button"
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className={`group relative h-20 w-20 flex-shrink-0 cursor-zoom-in overflow-hidden rounded-lg bg-muted ring-2 transition-all duration-300 hover:ring-primary ${
                idx === 0
                  ? "ring-primary/50"
                  : "ring-transparent hover:ring-primary/40"
              }`}
            >
              <Image
                src={url}
                alt={`${spotName} - Foto ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
      />
    </div>
  );
}
