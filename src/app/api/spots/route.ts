import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { z } from "zod/v4";

// Valid values for enum fields
const REGIONS = [
  "Schleswig-Holstein",
  "Hamburg",
  "Bremen",
  "Niedersachsen",
  "Mecklenburg-Vorpommern",
] as const;

const BEST_TIMES = ["morning", "midday", "evening", "night"] as const;

const CATEGORIES = [
  "Küste",
  "Wattenmeer",
  "Wald",
  "See/Teich",
  "Stadtansicht",
  "Leuchtturm",
  "Sonnenuntergang",
  "Sonstiges",
] as const;

// Zod schema for creating a new spot
const createSpotSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich").max(200, "Name darf max. 200 Zeichen lang sein"),
  region: z.enum(REGIONS, { message: "Ungültige Region" }),
  latitude: z.number().min(-90).max(90, "Breitengrad muss zwischen -90 und 90 liegen"),
  longitude: z.number().min(-180).max(180, "Längengrad muss zwischen -180 und 180 liegen"),
  description: z.string().min(1, "Beschreibung ist erforderlich").max(2000, "Beschreibung darf max. 2000 Zeichen lang sein"),
  best_time: z.enum(BEST_TIMES).optional().nullable(),
  equipment: z.string().max(500, "Ausrüstung darf max. 500 Zeichen lang sein").optional().nullable(),
  photo_tips: z.string().max(1000, "Foto-Tipps dürfen max. 1000 Zeichen lang sein").optional().nullable(),
  categories: z.array(z.enum(CATEGORIES)).optional().default([]),
  photos: z.array(z.string().url()).max(5, "Max. 5 Fotos erlaubt").optional().default([]),
  cover_photo: z.string().url().optional().nullable(),
  // Honeypot field: must be empty if submitted by a human
  website: z.string().max(0, "Spam detected").optional().default(""),
});

/**
 * GET /api/spots
 * Returns all approved fotospots, ordered by creation date (newest first).
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    const { data, error, count } = await supabase
      .from("fotospots")
      .select("*", { count: "exact" })
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching spots:", error);
      return NextResponse.json(
        { error: "Fehler beim Laden der Fotospots." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, total: count });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/spots
 * Creates a new fotospot. No authentication required (MVP: anonymous submissions).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = createSpotSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json({ error: "Validierungsfehler", details: errors }, { status: 400 });
    }

    const validatedData = result.data;

    // Honeypot check: if "website" field is filled, it's likely a bot
    if (validatedData.website && validatedData.website.length > 0) {
      // Silently accept but don't save (don't reveal spam detection)
      return NextResponse.json({ data: { id: "ignored" } }, { status: 201 });
    }

    // Remove honeypot field before saving
    const { website: _honeypot, ...spotData } = validatedData;

    // Set cover_photo to first photo if not explicitly set
    const dataToInsert = {
      ...spotData,
      cover_photo: spotData.cover_photo || spotData.photos?.[0] || null,
      is_approved: true, // MVP: auto-approve all spots
    };

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("fotospots")
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating spot:", error);
      return NextResponse.json(
        { error: "Fehler beim Speichern des Fotospots." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
