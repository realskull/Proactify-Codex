import { createClient } from "@/utils/supabase/server";
import VideoLeaderboard from "./VideoLeaderboard";
import ClientUserId from "./ClientUserId";

export const metadata = {
  title: "Leaderboard • Proactify",
};

export default async function LeaderboardsPage() {
  // ---------------------------------------------------------
  // Server-side Supabase client.
  // MUST be awaited inside a Server Component or Route Handler
  // because it uses next/headers under the hood.
  // ---------------------------------------------------------
  const supabase = await createClient();

  // Will contain the Discord provider ID or null
  let currentUserId: string | null = null;

  try {
    // -------------------------------------------------------
    // Try to fetch the authenticated user on the server.
    //
    // This works only when:
    // - Session cookies exist
    // - Middleware has authenticated the user
    //
    // If for some reason cookies are unavailable (rare),
    // this will throw and we fall back to client-side auth.
    // -------------------------------------------------------
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // -------------------------------------------------------
    // Extract the *Discord identity*.
    //
    // Why Discord ID and not auth UUID?
    // - Your Discord bot writes study sessions using discordId
    // - Leaderboards SQL groups by discordId
    // - So the UI must highlight by discordId
    //
    // Fallback order:
    // 1. provider_id (primary)
    // 2. sub (same in most cases)
    // 3. user.id (Supabase UUID if Discord fields missing)
    // -------------------------------------------------------
    currentUserId =
      user?.user_metadata?.provider_id ||
      user?.user_metadata?.sub ||
      user?.id ||
      null;
  } catch {
    // -------------------------------------------------------
    // If SSR auth lookup fails (e.g., no cookies, edge-case),
    // we will handle it client-side instead.
    // -------------------------------------------------------
    currentUserId = null;
  }

  return (
    <>
      {/* -----------------------------------------------------
        CASE 1 — SSR success:
        We already know the user's Discord ID from the server.
        Render the leaderboard immediately (faster, no flicker).
      ------------------------------------------------------ */}
      {currentUserId !== null && (
        <VideoLeaderboard currentUserId={currentUserId} />
      )}

      {/* -----------------------------------------------------
        CASE 2 — SSR failed:
        Use client-side Supabase to get the user.
        (This is the safe fallback for hydration mismatches).
      ------------------------------------------------------ */}
      {currentUserId === null && <ClientUserId />}
    </>
  );
}

