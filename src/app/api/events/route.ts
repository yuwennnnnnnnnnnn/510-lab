import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { EventCategory } from "@/lib/types";

const VALID_CATEGORIES: EventCategory[] = ["lecture", "workshop", "career", "social"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as EventCategory | null;

    let query = supabase.from("events").select("*").order("date", { ascending: true });

    if (category && VALID_CATEGORIES.includes(category)) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Assert: Supabase must return an array
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Unexpected data format from database" },
        { status: 500 }
      );
    }

    // Assert: each event has required fields
    for (const event of data) {
      if (!event.id || !event.title || !event.category || !event.date) {
        return NextResponse.json(
          { error: "Event record missing required fields" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to query events" }, { status: 500 });
  }
}
