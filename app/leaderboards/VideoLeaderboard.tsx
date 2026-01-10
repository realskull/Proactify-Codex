"use client";

import { useEffect, useState } from "react";

// Converts ms → human-readable
function formatMs(ms: number) {
  if (!ms) return "0m";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
}

export default function VideoLeaderboard({
  currentUserId,
}: {
  currentUserId: string | null;
}) {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard/video")
      .then((res) => res.json())
      .then((data) => setLeaders(data || []));
  }, []);

  // Loading state
  if (!leaders.length) {
    return (
      <div className="w-full flex justify-center mt-12">
        <p className="text-text text-center opacity-70">
          Loading leaderboard…
        </p>
      </div>
    );
  }

  const real = leaders.filter((u) => u.username);

  const TOTAL_SLOTS = 23;
  const placeholdersNeeded = Math.max(0, TOTAL_SLOTS - real.length);

  const placeholders = Array.from({ length: placeholdersNeeded }).map(
    (_, i) => ({
      user_id: `placeholder-${i}`,
      username: `Student ${real.length + i + 1}`,
      avatar_url: null,
      total_ms: 0,
      placeholder: true,
    })
  );

  const fullList = [...real, ...placeholders];

  const top3 = fullList.slice(0, 3);
  const rest = fullList.slice(3);

  /** Avatar bubble */
  const Avatar = ({ src, size = 64 }: { src: string | null; size?: number }) => (
    <div
      className="
        rounded-full 
        bg-surface-alt
        border-2 border-border
        overflow-hidden flex items-center justify-center
      "
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} className="w-full h-full object-cover" alt="avatar" />
      ) : (
        <div className="text-xs text-bg opacity-60">N/A</div>
      )}
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          w-full max-w-md p-6 space-y-8 mb-8 mt-8 rounded-2xl border-2
          bg-surface
          border-border
          text-text
        "
      >
        {/* Title + Disclaimer */}
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Past 30 Days
        </h2>

        <p className="text-center text-xs opacity-60 -mt-4 mx-8">
          The leaderboard tracks total video time. Your camera must be on to appear.
        </p>

        {/* Top 3 */}
        <div className="flex flex-col items-center w-full">
          {/* First place */}
          {top3[0] && (
            <div className="flex flex-col items-center -mb-26">
              <div className="relative flex flex-col items-center -mt-2">
                <Avatar src={top3[0].avatar_url} size={85} />

                <div
                  className="
                    absolute bottom-0 translate-y-3 w-7 h-7 rounded-full
                    bg-gold text-white
                    flex items-center justify-center text-xs font-bold
                  "
                >
                  1
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold">{top3[0].username}</p>
              <p className="text-xs opacity-70">{formatMs(top3[0].total_ms)}</p>
            </div>
          )}

          {/* Second + Third */}
          <div className="grid grid-cols-2 gap-x-32 gap-y-2 w-full max-w-xs">
            {/* Second */}
            {top3[1] && (
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                  <Avatar src={top3[1].avatar_url} size={85} />
                  <div
                    className="
                      absolute bottom-0 translate-y-3 w-7 h-7 rounded-full
                      bg-silver text-white
                      flex items-center justify-center text-xs font-bold
                    "
                  >
                    2
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold">{top3[1].username}</p>
                <p className="text-xs opacity-70">{formatMs(top3[1].total_ms)}</p>
              </div>
            )}

            {/* Third */}
            {top3[2] && (
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                  <Avatar src={top3[2].avatar_url} size={85} />
                  <div
                    className="
                      absolute bottom-0 translate-y-3 w-7 h-7 rounded-full
                      bg-bronze text-white
                      flex items-center justify-center text-xs font-bold
                    "
                  >
                    3
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold">{top3[2].username}</p>
                <p className="text-xs opacity-70">{formatMs(top3[2].total_ms)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Remaining list */}
        <div className="space-y-2">
          {rest.map((user, i) => {
            const rank = i + 4;
            const isMe = user.user_id === currentUserId;

            return (
              <div
                key={user.user_id}
                className={[
                  "flex items-center p-3 rounded-xl border max-w-xs mx-auto",

                  // Instant theme switching — no transitions
                  isMe
                    ? "bg-surface-alt border-blue"
                    : "bg-surface border-border",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 flex-1">
                  <p className="w-6 text-center font-bold text-sm">{rank}</p>
                  <Avatar src={user.avatar_url} size={32} />
                  <p className="font-medium text-sm">{user.username}</p>
                </div>

                <p className="text-xs opacity-70">{formatMs(user.total_ms)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

