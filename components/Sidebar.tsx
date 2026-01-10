"use client";

import {
  BarChart3,
  Trophy,
  Users,
  CheckSquare,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import SidebarLink from "./SidebarLink";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTheme, setTheme } from "@/utils/theme";

export default function Sidebar() {
  const supabase = createClient();
  const router = useRouter();

  const [darkMode, setDarkModeState] = useState<"light" | "dark" | null>(null);

  // Prevent flashing + hydrate theme
  useEffect(() => {
    const mode = getTheme(); // defaults to dark if nothing stored
    setDarkModeState(mode);
    setTheme(mode);
  }, []);

  if (!darkMode) return null;

  function toggleDark() {
    const next = darkMode === "light" ? "dark" : "light";
    setDarkModeState(next);
    setTheme(next);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className="
        hidden md:flex flex-col justify-between
        w-52 h-screen fixed left-0 top-0
        border-r-2 border-border
        bg-surface
        px-4 py-6
        text-text
      "
    >
      {/* Logo */}
      <div>
        <div className="pb-6 pl-2">
          <Image
            src={
              darkMode === "dark"
                ? "/icons/Proactify-Light.svg"
                : "/icons/Proactify.svg"
            }
            alt="Proactify Logo"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </div>

        <nav className="space-y-1">
          <SidebarLink href="/dashboard" icon={<BarChart3 size={18} />} label="Study Stats" />
          <SidebarLink href="/leaderboards" icon={<Trophy size={18} />} label="Leaderboard" />
          <SidebarLink href="/rooms" icon={<Users size={18} />} label="Join Rooms" />
          <SidebarLink href="/todo" icon={<CheckSquare size={18} />} label="To-Do List" />
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-center px-2 pb-1">

        {/* THEME TOGGLE */}
        <div className="relative group">
          <button onClick={toggleDark} className="transition group cursor-pointer">
            <div
              className="
                w-11 h-11 rounded-xl
                bg-surface-alt border-2 border-border
                flex items-center justify-center
                transition-colors
                group-hover:bg-toggle-bg
                group-hover:border-toggle-border
              "
            >
              {darkMode === "dark" ? (
                <Sun className="w-6 h-6 text-text group-hover:text-toggle transition-colors" />
              ) : (
                <Moon className="w-6 h-6 text-text group-hover:text-toggle transition-colors" />
              )}
            </div>
          </button>

          {/* Tooltip */}
          <span
            className="
              absolute right-14 top-1/2 -translate-y-1/2
              bg-surface-alt text-text
              text-xs px-2 py-1 rounded-md pointer-events-none
              opacity-0 group-hover:opacity-100 transition-opacity
              shadow-lg whitespace-nowrap
            "
          >
            Toggle Theme
          </span>
        </div>

        {/* LOGOUT */}
        <div className="relative group">
          <button onClick={handleLogout} className="transition group cursor-pointer">
            <div
              className="
                w-11 h-11 rounded-xl
                bg-surface-alt border-2 border-border
                flex items-center justify-center
                transition-colors
                group-hover:bg-warning-bg
                group-hover:border-warning-border
              "
            >
              <LogOut className="w-6 h-6 text-text group-hover:text-warning transition-colors" />
            </div>
          </button>

          <span
            className="
              absolute right-14 top-1/2 -translate-y-1/2
              bg-surface-alt text-text
              text-xs px-2 py-1 rounded-md pointer-events-none
              opacity-0 group-hover:opacity-100 transition-opacity
              shadow-lg whitespace-nowrap
            "
          >
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
}

