"use client";
import { useEffect, useState } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (!saved) {
      // Default to dark mode if first time
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
      return;
    }

    const isDark = saved === "dark";
    setDark(isDark);

    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  function toggleDark() {
    const newVal = !dark;
    setDark(newVal);

    if (newVal) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return { dark, toggleDark };
}

