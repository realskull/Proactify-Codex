"use client";

import { useEffect } from "react";
import LoginCard from "@/components/LoginCard";
import { createClient } from "@/utils/supabase/client";

export default function LoginClient() {
  const supabase = createClient();

  // 🔥 Always-dark login page + sets default for first-time users
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  async function loginWithDiscord() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return <LoginCard onLogin={loginWithDiscord} />;
}

