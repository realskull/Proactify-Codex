"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { setTheme, getTheme } from "@/utils/theme";

export default function DarkModeToggle() {
  const [mode, setModeState] = useState<"light" | "dark">();

  // Prevents flashing — wait until mounted before rendering
  useEffect(() => {
    setModeState(getTheme());
  }, []);

  if (!mode) return null; // Avoid SSR mismatch + prevent flicker

  function toggle() {
    const next = mode === "light" ? "dark" : "light";
    setModeState(next);
    setTheme(next);
  }

  const Icon = mode === "light" ? Moon : Sun;

  // Mode-dependent hover accents
  const hoverBg =
    mode === "light" ? "hover:bg-toggle-bg" : "hover:bg-toggle-bg";
  const hoverBorder =
    mode === "light" ? "hover:border-toggle-border" : "hover:border-toggle-border";
  const hoverIcon =
    mode === "light" ? "group-hover:text-toggle" : "group-hover:text-toggle";

  return (
    <button onClick={toggle} className="group transition cursor-pointer">
      <div
        className={`
          w-11 h-11 rounded-xl
          bg-surface-alt
          border-2 border-border
          flex items-center justify-center
          transition-colors

          ${hoverBg}
          ${hoverBorder}
        `}
      >
        <Icon
          className={`
            w-6 h-6 text-text transition-colors
            ${hoverIcon}
          `}
        />
      </div>
    </button>
  );
}

