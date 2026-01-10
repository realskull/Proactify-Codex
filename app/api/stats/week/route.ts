import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// This endpoint returns an array of 7 numbers representing weekly study minutes.
// It's used by your WeeklyChart component on the dashboard.
export async function GET(req: Request) {

  // Convert the incoming request into a URL object so we can extract parameters.
  const url = new URL(req.url);

  // Extract ?id=<user_uuid> from the query string.
  // NOTE: This userId is the *Supabase profile UUID*, not the Discord ID.
  const userId = url.searchParams.get("id");

  // If no ?id was provided, return a fallback array of zeros.
  // WeeklyChart always expects a 7-element array.
  if (!userId) {
    console.warn("Missing ?id in /api/stats/week");
    return NextResponse.json(new Array(7).fill(0));
  }

  // Create a server-side Supabase client.
  // This attaches cookies automatically if needed for RLS.
  const supabase = await createClient();

  // Call your RPC function in Postgres.
  // IMPORTANT: The parameter name "user_uuid" MUST match your RPC definition.
  //
  // Your RPC returns something like:
  // [0, 15, 32, 0, 0, 45, 5]
  //
  // Where the array is always length 7:
  // [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
  const { data, error } = await supabase.rpc("get_weekly_minutes", {
    user_uuid: userId, // <-- Correct argument name for your function
  });

  // If the RPC fails OR returns null, log it and return zeros.
  // Returning zeros keeps the UI stable and prevents crashes.
  if (error || !data) {
    console.error("RPC weekly error:", error);
    return NextResponse.json(new Array(7).fill(0));
  }

  // Success → return the 7-number array.
  return NextResponse.json(data);
}

