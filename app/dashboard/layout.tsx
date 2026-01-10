"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Desktop sidebar (always visible on md+ screens) */}
      <Sidebar />

      {/* Mobile sidebar (slide-out menu for small screens) */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content wrapper */}
      <div
        className="
          flex-1 min-h-screen 
          bg-bg
          text-text
        "
      >
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} title="Dashboard" />

        {/* Page content */}
        <main className="pt-6 px-4 md:ml-52 flex justify-center">
          <div className="w-full max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

