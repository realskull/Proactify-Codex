"use client";

import React from "react";
import { Flame } from "lucide-react";
import { MonthlyStudyMap } from "@/lib/stats";

const MIN_REQUIRED = 30;

function toLAKey(date: Date): string {
  const d = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${da}`;
}

export default function StreakTracker({
  monthMap,
}: {
  monthMap: MonthlyStudyMap;
}) {
  const today = new Date();
  const todayKey = toLAKey(today);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(today.getUTCDate() - (29 - i));

    const key = toLAKey(d);
    const minutes = monthMap[key] ?? 0;
    const qualifies = minutes >= MIN_REQUIRED;

    return { key, qualifies };
  });

  let chains: string[][] = [];
  let current: string[] = [];

  for (const d of days) {
    if (d.qualifies) current.push(d.key);
    else if (current.length > 0) {
      chains.push(current);
      current = [];
    }
  }
  if (current.length > 0) chains.push(current);

  const longest = chains.sort((a, b) => b.length - a.length)[0] ?? [];
  const lastChain = chains[chains.length - 1] ?? [];
  const currentStreak = lastChain.includes(todayKey) ? lastChain.length : 0;

  return (
    <div
      className="
        w-full max-w-md p-8 rounded-2xl border-2
        bg-surface
        border-border
        text-text
      "
    >
      <h2 className="text-lg font-semibold mb-2">Past 30 Days Streak</h2>

      <p className="text-xs mb-4 opacity-70">
        Must study at least 30 minutes per day to count toward a streak.
      </p>

      <div className="border-b my-8 border-border"></div>

      {/* Streak dots */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-y-6 place-items-center">
        {days.map(({ key, qualifies }) => {
          const isLongest = longest.includes(key);

          return (
            <div key={key} className="relative group">
              <div
                className={[
                  "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center",
                  "transition-transform duration-200",

                  // 🔥 Subtle orange glow when qualifies
                  qualifies
                    ? "bg-orange shadow-[0_0_10px_rgba(255,206,81,0.65)]"
                    : "bg-light-gray",

                  isLongest && qualifies ? "text-lg" : "text-transparent",
                ].join(" ")}
              >
                {isLongest && qualifies ? (
                  <Flame
                    size={18}
                    strokeWidth={2.5}
                    className="text-red"
                  />
                ) : null}
              </div>

              {/* Tooltip */}
              <div
                className="
                  absolute bottom-10 left-1/2 -translate-x-1/2
                  px-2 py-1 text-xs rounded-md border
                  border-border
                  bg-surface
                  text-text
                  whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-150 pointer-events-none
                "
              >
                {key}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-b my-8 border-border"></div>

      <div className="flex justify-center gap-6 text-sm">
        <p>
          <span className="font-semibold">{currentStreak}</span> day current streak
        </p>
        <p>
          <span className="font-semibold">{longest.length}</span> day longest streak
        </p>
      </div>
    </div>
  );
}

