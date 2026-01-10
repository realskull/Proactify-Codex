"use server";
// -----------------------------------------------------------
// This marks the module as "server-only". It ensures that
// Next.js never bundles this file into client-side JavaScript.
// -----------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";

export async function createClient() {
  // ---------------------------------------------------------
  // Next.js App Router (server components + route handlers)
  // stores all request cookies inside `next/headers`.
  //
  // We must call `cookies()` INSIDE the function (not outside)
  // so it reads the cookies of *each incoming request*.
  //
  // Also: in Next 14+ TypeScript complains unless you await it.
  // ---------------------------------------------------------
  const cookieStore = await nextCookies();

  // ---------------------------------------------------------
  // Create a Supabase *server-side* client.
  //
  // Difference from browser client:
  // - Server client reads HTTP-only cookies automatically
  // - Can authenticate SSR pages
  // - Useful for server actions + API routes
  // ---------------------------------------------------------
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,         // Public project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,   // Public anon key
    {
      cookies: {
        // ---------------------------------------------------
        // Supabase SSR requires implementing get/set/remove
        // so it knows how to interact with Next.js cookies.
        //
        // These methods allow Supabase to:
        // - read session tokens
        // - refresh session tokens
        // - write updated cookies
        //
        // NOTE: All of these wrap Next.js' cookie system.
        // ---------------------------------------------------

        get(name: string) {
          // Read a cookie. Return "" if missing.
          return cookieStore.get(name)?.value ?? "";
        },

        set(name: string, value: string, options: any) {
          // Attempt to set a cookie.
          // Wrapped in try/catch because Next.js can throw
          // when you try to set cookies outside a valid request.
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignore silently — avoids crashing server routes
          }
        },

        remove(name: string, options: any) {
          // Removing = setting empty cookie + maxAge: 0
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch {
            // Same reasoning — avoid runtime edge-case crashes
          }
        },
      },
    }
  );
}

