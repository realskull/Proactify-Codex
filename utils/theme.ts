// -------------------------------------------------------------
// Theme Utilities
// - Dark mode is the default
// - Reads/writes localStorage
// - Keeps both data-theme + .dark class in sync
// -------------------------------------------------------------

export function setTheme(mode: "light" | "dark") {
  if (typeof document === "undefined") return;

  // Save preference
  localStorage.setItem("theme", mode);

  // Update attribute
  document.documentElement.setAttribute("data-theme", mode);

  // Update .dark class
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function getTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "dark"; // default on SSR

  // Read saved theme
  const stored = localStorage.getItem("theme");

  // If user has a preference saved, use it
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  // Otherwise default to dark mode globally
  return "dark";
}

