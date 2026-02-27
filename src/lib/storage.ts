/**
 * Supabase Storage helpers for the spot-photos bucket.
 */

const BUCKET_NAME = "spot-photos";

/**
 * Builds the public URL for a file in the spot-photos bucket.
 */
export function getPublicPhotoUrl(filePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
}

/**
 * Generates a unique file path for a spot photo upload.
 * Format: {spotFolder}/{uuid}.{ext}
 */
export function generatePhotoPath(
  spotFolder: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const uuid = crypto.randomUUID();
  return `${spotFolder}/${uuid}.${ext}`;
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PHOTOS_PER_SPOT = 5;
export const STORAGE_BUCKET = BUCKET_NAME;
