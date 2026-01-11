"use client";

import {
  BarChart3,
  LayoutGrid,
  Trophy,
  Users,
  CheckSquare,
  User,
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

export default function MobileSidebar({ open, setOpen }: any) {
  const supabase = createClient();
  const router = useRouter();

  const [darkMode, setDarkModeState] = useState<"light" | "dark" | null>(null);

  // Prevent flash: hydrate from theme utils
  useEffect(() => {
    const mode = getTheme();
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
    <div
      className={`
        fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden
        ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={() => setOpen(false)}
    >
      <aside
        className={`
          absolute top-0 left-0 h-full w-52
          bg-surface border-r-2 border-border text-text
          p-6 transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full justify-between">

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
              <SidebarLink href="/kanban" icon={<LayoutGrid size={18} />} label="Kanban Board" />
              <SidebarLink href="/profile" icon={<User size={18} />} label="Profile" />
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

              <span
                className="
                  absolute left-14 top-1/2 -translate-y-1/2
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
        </div>
      </aside>
    </div>
  );
}
