export const metadata = {
  title: "Profile • Proactify",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-semibold">
              MJ
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Mina Johnson</h1>
              <p className="text-sm text-text-muted">Level 12 • 8,450 XP</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-alt px-3 py-1 text-xs text-text-muted">
              Focus streak: 12 days
            </span>
            <span className="rounded-full bg-surface-alt px-3 py-1 text-xs text-text-muted">
              Night owl sessions: 6
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 text-sm text-text-muted">
              Product-minded learner who enjoys late-night deep work sessions, co-working with
              friends, and mapping study progress into RPG-style quests.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Weekly goal", value: "12 hours" },
                { label: "Current quest", value: "Sprint launch" },
                { label: "Favorite focus", value: "Pomodoro 50/10" },
                { label: "Study room", value: "Night Shift" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-bg p-4">
                  <p className="text-xs uppercase text-text-muted">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">Active study servers</h2>
            <p className="mt-2 text-sm text-text-muted">
              Explore new rooms and keep your streaks alive with friends.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { name: "Night Shift", members: "214 members", status: "Live" },
                { name: "Focus Cove", members: "156 members", status: "New" },
                { name: "Weekend Sprint", members: "98 members", status: "Upcoming" },
              ].map((room) => (
                <div
                  key={room.name}
                  className="flex items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">{room.name}</p>
                    <p className="text-xs text-text-muted">{room.members}</p>
                  </div>
                  <span className="rounded-full bg-surface-alt px-3 py-1 text-xs text-text-muted">
                    {room.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">XP Progress</h2>
            <p className="mt-1 text-xs text-text-muted">8,450 / 10,000 XP</p>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-alt">
              <div className="h-full w-[82%] rounded-full bg-primary" />
            </div>
            <p className="mt-3 text-xs text-text-muted">1,550 XP to Level 13</p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold">Mascot</h2>
            <p className="mt-2 text-sm text-text-muted">
              Meet Focus Fox — your friendly study companion.
            </p>
            <div className="mt-4 flex justify-center">
              <svg
                width="180"
                height="180"
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="180" height="180" rx="36" fill="#1F2937" />
                <path
                  d="M55 120C55 96.25 73.25 78 97 78C120.75 78 139 96.25 139 120"
                  stroke="#F97316"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <circle cx="72" cy="94" r="10" fill="#FBBF24" />
                <circle cx="118" cy="94" r="10" fill="#FBBF24" />
                <path
                  d="M88 112H106"
                  stroke="#FBBF24"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M48 66L68 86"
                  stroke="#F97316"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M132 66L112 86"
                  stroke="#F97316"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
