// utils/supabase/client.ts
// -------------------------------------------------------
// This file creates the Supabase client specifically
// for *client-side React components*.
//
// It uses `createBrowserClient()` which:
// - Runs only in the browser
// - Uses localStorage/sessionStorage for tokens
// - Does NOT access HTTP-only cookies (that's server-only)
// -------------------------------------------------------

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Create a Supabase client configured for the browser.
  // Uses the public URL + public anon key.
  //
  // IMPORTANT:
  // - This client automatically refreshes tokens on the client
  // - It should not be used on the server (use server.ts instead)
  //
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,       // Public project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Public anon key
  );
}

