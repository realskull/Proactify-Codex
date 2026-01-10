// lib/stats.ts
// Server-side utilities for fetching study stats from Supabase via RPC.

// These functions should ONLY be used in:
// - Server Components
// - Server Actions
// - API Routes
//
// Not inside client components — because they rely on the server-side Supabase client.

import { createClient } from "@/utils/supabase/server";

/* ======================================================
   WEEKLY — last 7 days (including today)
   ------------------------------------------------------
   This fetches data from your PostgreSQL stored function:
     get_weekly_minutes(_user_id UUID)
   
   The SQL already:
   - Computes LA-local day boundaries
   - Aggregates duration for each day
   - Returns exactly 7 numbers (oldest → newest)
   
   So this function simply forwards the request to Supabase.
   ====================================================== */
export async function getWeeklyStudyMinutes(userId: string): Promise<number[]> {
  // Create server-side Supabase client (reads cookies automatically)
  const supabase = await createClient();

  // Call the RPC (must match the argument name in SQL!)
  const { data, error } = await supabase.rpc("get_weekly_minutes", {
    _user_id: userId,
  });

  // Log and return safe fallback if something goes wrong
  if (error) {
    console.error("getWeeklyStudyMinutes error:", error);
    return new Array(7).fill(0); // Return [0,0,0,0,0,0,0]
  }

  // Always return an array — RPC may return null if user has no data
  return data ?? new Array(7).fill(0);
}

/* ======================================================
   MONTH — past 30-day map for streaks
   ------------------------------------------------------
   Fetches from the SQL function:
     get_last_30_days_map(_user_id UUID)
   
   Returns a JSON object shaped like:
     {
       "2025-01-03": 42,
       "2025-01-04": 60,
       ...
     }
   
   Only days with >0 minutes appear in the object.
   The streak tracker normalizes missing days to 0.
   ====================================================== */
export type MonthlyStudyMap = Record<string, number>;

export async function getLast30DaysMap(
  userId: string
): Promise<MonthlyStudyMap> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_last_30_days_map", {
    _user_id: userId,
  });

  // Graceful fallback if RPC fails
  if (error) {
    console.error("getLast30DaysMap error:", error);
    return {};
  }

  // Return {} if no data (empty map)
  return data ?? {};
}

