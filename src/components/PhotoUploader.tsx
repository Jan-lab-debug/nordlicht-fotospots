"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, Star, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const MAX_FILES = 5;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export interface UploadedPhoto {
  url: string;
  path: string;
  localPreview?: string;
}

interface PhotoUploaderProps {
  photos: UploadedPhoto[];
  onPhotosChange: (photos: UploadedPhoto[]) => void;
  spotFolder: string;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

export function PhotoUploader({
  photos,
  onPhotosChange,
  spotFolder,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  const uploadFile = async (file: File): Promise<UploadedPhoto | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("spotFolder", spotFolder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload fehlgeschlagen");
    }

    const { data } = await res.json();
    return { url: data.url, path: data.path };
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = MAX_FILES - photos.length - uploading.length;
      if (remainingSlots <= 0) return;

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      const newUploading: UploadingFile[] = filesToUpload.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
      }));

      setUploading((prev) => [...prev, ...newUploading]);

      for (const item of newUploading) {
        try {
          // Simulate progress
          setUploading((prev) =>
            prev.map((u) => (u.id === item.id ? { ...u, progress: 30 } : u))
          );

          const result = await uploadFile(item.file);

          setUploading((prev) =>
            prev.map((u) => (u.id === item.id ? { ...u, progress: 100 } : u))
          );

          if (result) {
            // Small delay to show 100% briefly
            await new Promise((r) => setTimeout(r, 300));
            onPhotosChange([...photos, { ...result, localPreview: item.preview }]);
            photos = [...photos, { ...result, localPreview: item.preview }];
          }

          setUploading((prev) => prev.filter((u) => u.id !== item.id));
        } catch (err) {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? {
                    ...u,
                    progress: 0,
                    error:
                      err instanceof Error
                        ? err.message
                        : "Upload fehlgeschlagen",
                  }
                : u
            )
          );
        }
      }
    },
    [photos, uploading.length, onPhotosChange, spotFolder]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_SIZE_BYTES,
      maxFiles: MAX_FILES - photos.length,
      disabled: photos.length >= MAX_FILES,
    });

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  const removeUploadingItem = (id: string) => {
    setUploading((prev) => {
      const item = prev.find((u) => u.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((u) => u.id !== id);
    });
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : photos.length >= MAX_FILES
            ? "cursor-not-allowed border-muted opacity-50"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        {photos.length >= MAX_FILES ? (
          <p className="text-sm text-muted-foreground">
            Maximum von {MAX_FILES} Fotos erreicht
          </p>
        ) : isDragActive ? (
          <p className="text-sm text-primary">Fotos hier ablegen...</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground">
              Fotos hier hinziehen oder{" "}
              <span className="font-medium text-primary">klicken</span> zum
              Auswählen
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              JPG, PNG oder WebP · Max. 10 MB · Max. {MAX_FILES} Fotos
            </p>
          </div>
        )}
      </div>

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              {fileRejections.length === 1
                ? "Eine Datei wurde abgelehnt."
                : `${fileRejections.length} Dateien wurden abgelehnt.`}{" "}
              Erlaubt: JPG, PNG, WebP (max. 10 MB).
            </span>
          </div>
        </div>
      )}

      {/* Photo previews */}
      {(photos.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {photos.map((photo, idx) => (
            <div
              key={photo.url}
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={photo.localPreview || photo.url}
                alt={`Foto ${idx + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
              {idx === 0 && (
                <Badge className="absolute left-1.5 top-1.5 gap-1 bg-accent text-accent-foreground text-[10px] px-1.5 py-0.5">
                  <Star className="h-2.5 w-2.5" />
                  Titelbild
                </Badge>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1.5 top-1.5 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removePhoto(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {/* Uploading items */}
          {uploading.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={item.preview}
                alt="Wird hochgeladen..."
                fill
                className="object-cover opacity-50"
                sizes="150px"
              />
              {item.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-2 text-center">
                  <AlertCircle className="mb-1 h-5 w-5 text-destructive" />
                  <p className="text-xs text-destructive">{item.error}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-6 text-xs text-muted-foreground"
                    onClick={() => removeUploadingItem(item.id)}
                  >
                    Entfernen
                  </Button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <Loader2 className="mb-2 h-6 w-6 animate-spin text-primary" />
                  <Progress
                    value={item.progress}
                    className="mx-4 h-1.5 w-3/4"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
