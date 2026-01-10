// middleware.ts
// =========================================================
// This middleware runs BEFORE every request (except ignored
// paths defined in the config matcher).
//
// Purpose:
// - Protect authenticated routes (dashboard, todo, rooms, etc.)
// - Redirect unauthenticated users to /login
// - Prevent logged-in users from seeing / or /login again
//
// This is the correct pattern for Supabase + Next.js App Router.
// =========================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that REQUIRE authentication
const PROTECTED = ["/dashboard", "/leaderboards", "/rooms", "/todo"];

export async function middleware(req: NextRequest) {
  // Base response passed downstream unless replaced
  const res = NextResponse.next();

  // =======================================================
  // Create a Supabase client that works inside middleware.
  //
  // Unlike server components, middleware uses NextRequest/
  // NextResponse manually for cookie management.
  //
  // This enables reading the user's session token here.
  // =======================================================
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookie value from request
        get: (name: string) => req.cookies.get(name)?.value ?? "",

        // Write cookie into outgoing response
        set: (name: string, value: string, options: any) => {
          res.cookies.set(name, value, options);
        },

        // Remove cookie by setting maxAge = 0
        remove: (name: string, options: any) => {
          res.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Extract user session (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Routing helpers
  const path = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

  const isProtected = PROTECTED.some((route) => path.startsWith(route));
  const isRoot = path === "/";
  const isLogin = path === "/login";

  /* ==========================================================
     CASE 1 — NOT LOGGED IN → Redirect to /login
     ----------------------------------------------------------
     This prevents users from accessing protected pages or
     the homepage without authentication.
     ========================================================== */
  if (!user) {
    if (isRoot || isProtected) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  /* ==========================================================
     CASE 2 — LOGGED IN → Redirect away from / and /login
     ----------------------------------------------------------
     Prevents authenticated users from seeing login page again.
     Useful when refreshing after OAuth callback.
     ========================================================== */
  if (user && (isRoot || isLogin)) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow request to continue normally
  return res;
}

/* ==========================================================
   MIDDLEWARE MATCHER CONFIG
   ----------------------------------------------------------
   Exclude:
   - /auth/callback → Required for OAuth to work
   - /api → API routes shouldn't be gated here
   - /_next → Next.js static + chunks
   - /_supabase → Supabase helper endpoints
   - Static files (favicon, robots, sitemap)
========================================================== */
export const config = {
  matcher: [
    // Everything EXCEPT excluded paths
    "/((?!auth/callback|api|_supabase|_next|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

