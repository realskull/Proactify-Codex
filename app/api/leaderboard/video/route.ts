import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// This route returns the past 30 days of total video time for ALL users.
// It is consumed by your VideoLeaderboard component.
export async function GET() {
  // Create a Supabase client using the server-side helper.
  // This uses cookies for auth if needed.
  const supabase = await createClient();

  // OPTIONAL: Retrieve the current logged-in user.
  // This isn't strictly required because the leaderboard
  // displays all users regardless of who is logged in.
  // BUT: It can be useful later if you want to mark "current user" on the API level.
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user || null;

  // Call your Postgres RPC function inside Supabase.
  // The RPC is expected to return an array of objects:
  // [
  //   { user_id: "...", username: "...", avatar_url: "...", total_ms: number },
  //   ...
  // ]
  const { data, error } = await supabase.rpc("get_video_leaderboard_30_days");

  // If Supabase returned an error, log it and return a 500 response.
  if (error) {
    console.error("Leaderboard RPC Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ensures the API NEVER returns `null` or `undefined`.
  // If `data` isn't an array for whatever reason, return an empty array.
  return NextResponse.json(Array.isArray(data) ? data : []);
}

