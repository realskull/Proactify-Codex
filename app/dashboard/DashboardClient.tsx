"use client";
// This file runs in the browser (client-side).
// Required because we're using useState, useEffect, and Supabase client helpers.

import { createClient } from "@/utils/supabase/client";
import WeeklyChart from "./WeeklyChart";
import StreakTracker from "./StreakTracker";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  // Initialize the Supabase client for client-side operations.
  // This version automatically attaches the user's session via browser cookies.
  const supabase = createClient();

  // Component state
  const [loading, setLoading] = useState(true);             // Tracks loading state
  const [week, setWeek] = useState<number[]>([]);           // Weekly study minutes (7-element array)
  const [monthMap, setMonthMap] = useState({});             // 30-day date→minutes object
  const [userId, setUserId] = useState<string | null>(null); // Supabase UUID of the logged-in user

  useEffect(() => {
    // This effect runs once on component mount.
    // It loads the user's UUID and fetches two API endpoints:
    // - weekly stats
    // - 30-day stats
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If no user is logged in, stop here.
      if (!user) {
        console.warn("No logged-in user");
        setLoading(false);
        return;
      }

      // --- REAL SUPABASE UUID ---
      // This UUID is used for ALL RPC lookups.
      const uuid = user.id;
      setUserId(uuid);

      try {
        // -------------------------
        // Fetch weekly study stats
        // -------------------------
        const weekRaw = await fetch(`/api/stats/week?id=${uuid}`);
        const weekJson = await weekRaw.json();

        // Validate format → ensure we always have a 7-element array.
        setWeek(Array.isArray(weekJson) ? weekJson : new Array(7).fill(0));

        // -------------------------
        // Fetch monthly study stats
        // -------------------------
        const monthRaw = await fetch(`/api/stats/month?id=${uuid}`);
        const monthJson = await monthRaw.json();

        // Ensure monthMap is always an object.
        setMonthMap(monthJson || {});
      } catch (err) {
        // Catches network or JSON parsing errors.
        console.error("Stats fetch error:", err);
      }

      // All loading complete
      setLoading(false);
    }

    load();
  }, []); // Empty dependency array → only runs once.

  // Loading UI (simple text feedback)
  if (loading) {
    return <p className="text-dark text-center mt-6">Loading dashboard…</p>;
  }

  // If no userId exists, do not render charts.
  // (This state occurs only if the user is not logged in.)
  if (!userId) return null;

  // Render WeeklyChart + StreakTracker once data is loaded.
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <WeeklyChart week={week} />
      <StreakTracker monthMap={monthMap} />
    </div>
  );
}

