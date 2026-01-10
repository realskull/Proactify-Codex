"use client";

import { Menu } from "lucide-react";

export default function Header({ setSidebarOpen, title }: any) {
  return (
    <header
      className="
        w-full h-16 flex items-center px-4 md:pl-60 pb-1
        bg-surface
        border-b-2 border-border
        text-text
      "
    >
      {/* Mobile hamburger */}
      <button
        className="md:hidden mr-4 mt-1"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} className="text-text" />
      </button>

      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
}

