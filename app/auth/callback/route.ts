import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);

  //
  // --------------------------------------------------------
  // Step 1: Extract the OAuth "code" returned by Discord.
  //
  // If missing (e.g. user cancels or Discord error), redirect
  // back to /login. This prevents users from getting stuck.
  // --------------------------------------------------------
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // --------------------------------------------------------
  // Step 2: Read the incoming cookies.
  //
  // IMPORTANT:
  // In the App Router, `cookies()` *must* be awaited inside
  // a route handler. Otherwise, Next.js throws invalid access
  // warnings.
  // --------------------------------------------------------
  const cookieStore = await cookies();

  // --------------------------------------------------------
  // Step 3: Prepare the redirect response.
  //
  // After exchanging the OAuth code for a Supabase session,
  // we will redirect the user to the dashboard.
  // --------------------------------------------------------
  const res = NextResponse.redirect(`${url.origin}/dashboard`);

  // --------------------------------------------------------
  // Step 4: Create a Supabase Server Client inside the
  // route handler. This version:
  //
  //  - Reads HTTP-only cookies
  //  - Updates cookies (refresh tokens, access tokens)
  //  - Allows us to call `exchangeCodeForSession`
  //
  // The `cookies` adapter ensures Supabase can update the
  // user's session token FROM the OAuth "code".
  // --------------------------------------------------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? "";
        },
        set(name: string, value: string, options: any) {
          // Write cookie back to the redirect response
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          // Delete cookie by overwriting it with maxAge = 0
          res.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  // --------------------------------------------------------
  // Step 5: Exchange the Discord OAuth code for a Supabase
  // session token.
  //
  // This method:
  //  - Validates the code with Supabase Auth
  //  - Stores refresh_token + access_token in cookies
  //  - Creates a full signed-in session for the user
  //
  // Basically, THIS is the moment the user logs in.
  // --------------------------------------------------------
  await supabase.auth.exchangeCodeForSession(code);

  // --------------------------------------------------------
  // Step 6: Redirect to dashboard with the new session active.
  // Middleware will see the user is logged-in and allow access.
  // --------------------------------------------------------
  return res;
}

