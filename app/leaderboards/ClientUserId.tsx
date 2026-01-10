"use client";
// -------------------------------------------------------------
// This component runs ONLY in the browser. It extracts the
// Discord provider ID from Supabase Auth, which identifies
// the user in your leaderboard tables.
//
// Reason:
// Your leaderboard RPC returns rows keyed by Discord ID
// (not auth UUID), because study sessions are stored by
// Discord ID inside the Discord bot.
// -------------------------------------------------------------

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import VideoLeaderboard from "./VideoLeaderboard";

export default function ClientUserId() {
  // Create a browser-side Supabase client
  const supabase = createClient();

  // Holds the Discord ID (string) or null while loading
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // -------------------------------------------------------
      // Get the logged-in Supabase user (browser version).
      // This uses the local storage tokens, not HTTP-only cookies.
      // -------------------------------------------------------
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If not logged in, simply don't render the leaderboard
      if (!user) {
        setId(null);
        return;
      }

      // -------------------------------------------------------
      // Pull the provider ID from user_metadata.
      //
      // Supabase Auth (Discord provider) sets BOTH:
      //   - provider_id (Discord user ID)
      //   - sub          (same Discord ID)
      //
      // So this fallback ensures safety.
      // -------------------------------------------------------
      const discordId =
        user.user_metadata?.provider_id || user.user_metadata?.sub;

      // Store Discord ID, which will be passed to leaderboard UI
      setId(discordId);
    }

    load();
  }, []);

  // Hide component until ID is known
  if (id === null) return null;

  // Pass the Discord ID into the leaderboard UI
  return <VideoLeaderboard currentUserId={id} />;
}

