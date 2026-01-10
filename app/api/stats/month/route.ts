import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// This endpoint returns a 30-day map of study time for a single user.
// It's used by your StreakTracker AND your MonthlyChart logic.
export async function GET(req: Request) {

  // Convert the incoming request into a URL object
  // so we can extract query parameters.
  const url = new URL(req.url);

  // Read ?id=<user_uuid> from the query string.
  // This is the Supabase *profile UUID* (not Discord ID).
  const userId = url.searchParams.get("id");

  // Guard clause: If no id was provided, return an empty object.
  // The UI expects `{}`, not null or undefined.
  if (!userId) {
    console.warn("Missing ?id in /api/stats/month");
    return NextResponse.json({});
  }

  // Create a Supabase client (server instance).
  // Automatically attaches cookies for RLS if needed.
  const supabase = await createClient();

  // Call your Postgres RPC (stored procedure) to fetch
  // the last 30 days of study data for this user.
  //
  // IMPORTANT: Notice the key name "_user_id".
  // Your RPC signature defines the argument as "_user_id",
  // so this must match EXACTLY.
  const { data, error } = await supabase.rpc("get_last_30_days_map", {
    _user_id: userId,  // <-- Correct parameter name for your RPC
  });

  // If the RPC errored OR returned null (rare), respond with empty data.
  // This prevents the frontend from crashing.
  if (error || !data) {
    console.error("RPC monthly error:", error);
    return NextResponse.json({});
  }

  // If everything succeeded, return the month map:
  // {
  //   "2025-11-21": 32,
  //   "2025-11-22": 18,
  //    ... etc ...
  // }
  return NextResponse.json(data);
}

