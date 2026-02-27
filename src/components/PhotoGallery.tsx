"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
        className="relative mb-3 aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={photos[0]}
          alt={`${spotName} - Hauptfoto`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
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
              className={`relative h-20 w-20 flex-shrink-0 cursor-zoom-in overflow-hidden rounded-md bg-muted ring-2 transition-all hover:ring-primary ${
                idx === 0
                  ? "ring-primary/50"
                  : "ring-transparent"
              }`}
            >
              <Image
                src={url}
                alt={`${spotName} - Foto ${idx + 1}`}
                fill
                className="object-cover"
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
          container: { backgroundColor: "rgba(0, 0, 0, 0.92)" },
        }}
      />
    </div>
  );
}
