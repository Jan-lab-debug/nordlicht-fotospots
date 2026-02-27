import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_PHOTOS_PER_SPOT,
  STORAGE_BUCKET,
  getPublicPhotoUrl,
} from "@/lib/storage";

/**
 * POST /api/upload
 * Uploads a photo to Supabase Storage.
 * Expects multipart/form-data with a "file" field and optional "spotFolder" field.
 * Returns the public URL of the uploaded file.
 *
 * No authentication required (MVP: anonymous uploads).
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const spotFolder = (formData.get("spotFolder") as string) || crypto.randomUUID();

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
      return NextResponse.json(
        {
          error: `Ungültiges Dateiformat. Erlaubt: JPG, PNG, WebP.`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Datei zu groß. Maximum: ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
        },
        { status: 400 }
      );
    }

    // Check how many files already exist in this folder (rate limit per spot)
    const supabase = await createServerSupabaseClient();
    const { data: existingFiles } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(spotFolder);

    if (existingFiles && existingFiles.length >= MAX_PHOTOS_PER_SPOT) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_PHOTOS_PER_SPOT} Fotos pro Spot erlaubt.`,
        },
        { status: 400 }
      );
    }

    // Generate unique file path
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `${spotFolder}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Fehler beim Hochladen der Datei." },
        { status: 500 }
      );
    }

    const publicUrl = getPublicPhotoUrl(filePath);

    return NextResponse.json(
      {
        data: {
          url: publicUrl,
          path: filePath,
          spotFolder,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
