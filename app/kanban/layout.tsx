"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import Header from "@/components/Header";

export default function KanbanLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar />
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 min-h-screen bg-bg text-text">
        <Header setSidebarOpen={setSidebarOpen} title="Kanban Board" />
        <main className="pt-6 px-4 md:ml-52">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
