import { createClient } from "@/utils/supabase/server";

/**
 * Server-side helper to get the currently logged-in user.
 *
 * This function should ONLY be used inside:
 * - Server Components (RSC)
 * - Route handlers (/api)
 * - Server Actions
 *
 * It will NOT work inside client components, because it depends on:
 *   1. Server-side Supabase client
 *   2. Access to HTTP-only auth cookies
 */
export async function getCurrentUser() {
  // Create a Supabase *server-side* client.
  // This automatically reads cookies from the incoming request context.
  const supabase = await createClient();

  // Fetch the authenticated user (if any).
  // Returns null if not logged in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Return the user object (or null).
  return user;
}

