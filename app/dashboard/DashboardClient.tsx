"use client";
// This file runs in the browser (client-side).
// Required because we're using useState, useEffect, and Supabase client helpers.

import { createClient } from "@/utils/supabase/client";
import WeeklyChart from "./WeeklyChart";
import StreakTracker from "./StreakTracker";
import { BadgeCheck, Crown, Flame, Sparkles } from "lucide-react";
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
  const achievements = [
    {
      title: "Consistency Champion",
      description: "14-day streak maintained",
      icon: Flame,
    },
    {
      title: "Night Owl",
      description: "10pm - 5am study sessions",
      icon: Sparkles,
    },
    {
      title: "Task Crusher",
      description: "Completed all tasks 5 days in a row",
      icon: BadgeCheck,
    },
    {
      title: "Level 12",
      description: "8,450 XP earned",
      icon: Crown,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <WeeklyChart week={week} />
      <StreakTracker monthMap={monthMap} />

      <section className="rounded-3xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-text">Achievements & XP</h2>
            <p className="text-sm text-text-muted">
              Earn badges for streaks, late-night focus, and task completion.
            </p>
          </div>
          <div className="rounded-full bg-surface-alt px-4 py-2 text-xs text-text-muted">
            3 new badges this month
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {achievements.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="flex items-center justify-between rounded-xl border border-border bg-bg px-3 py-3 text-xs text-text"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold">{badge.title}</p>
                    <p className="text-text-muted">{badge.description}</p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-alt px-2 py-1 text-[10px] text-text-muted">
                  Earned
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Focused sessions", value: "18", detail: "+12% vs last week" },
          { label: "Tasks completed", value: "42", detail: "+9 streak bonus" },
          { label: "Avg. session length", value: "52m", detail: "Peak at 10:30pm" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-border bg-surface p-5"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold text-text">{metric.value}</p>
            <p className="mt-2 text-xs text-text-muted">{metric.detail}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
