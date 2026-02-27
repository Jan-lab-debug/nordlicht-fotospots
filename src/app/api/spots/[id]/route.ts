import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { z } from "zod/v4";

// Validate UUID format
const uuidSchema = z.string().uuid("Ungültige Spot-ID");

/**
 * GET /api/spots/[id]
 * Returns a single approved fotospot by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    const idResult = uuidSchema.safeParse(id);
    if (!idResult.success) {
      return NextResponse.json(
        { error: "Ungültige Spot-ID." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("fotospots")
      .select("*")
      .eq("id", id)
      .eq("is_approved", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Fotospot nicht gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten." },
      { status: 500 }
    );
  }
}
