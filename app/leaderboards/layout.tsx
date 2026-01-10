"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import Header from "@/components/Header";

export default function LeaderboardsLayout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile slide-out sidebar */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main right content */}
      <div
        className="
          flex-1 min-h-screen
          bg-bg
          text-text
        "
      >
        {/* Page header */}
        <Header setSidebarOpen={setSidebarOpen} title="Leaderboard" />

        {/* Page content centered */}
        <main className="pt-6 px-4 md:ml-52 flex justify-center">
          <div className="w-full max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

