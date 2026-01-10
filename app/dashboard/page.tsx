import DashboardClient from "./DashboardClient";

// SEO metadata
export const metadata = {
  title: "Dashboard • Proactify",
};

// Server component wrapper
export default function DashboardPage() {
  return (
    <div
      className="
        min-h-screen p-6
        bg-bg
        text-text
      "
    >
      <DashboardClient />
    </div>
  );
}

