const boardColumns = [
  {
    title: "Backlog",
    count: 4,
    accent: "bg-rose-500",
    tasks: [
      {
        title: "Customer journey mapping",
        description: "Align on the personas and success metrics for the Q2 launch.",
        tag: "Research",
        due: "Mon",
        assignees: ["AR", "KD"],
      },
      {
        title: "Competitive teardown",
        description: "Summarize positioning and pricing gaps across top 5 rivals.",
        tag: "Strategy",
        due: "Tue",
        assignees: ["LW"],
      },
    ],
  },
  {
    title: "In Progress",
    count: 3,
    accent: "bg-amber-500",
    tasks: [
      {
        title: "Design system audit",
        description: "Catalog component inconsistencies and propose cleanups.",
        tag: "Design",
        due: "Today",
        assignees: ["MP", "AR"],
      },
      {
        title: "Onboarding copy refresh",
        description: "Rewrite the activation email and tutorial scripts.",
        tag: "Content",
        due: "Wed",
        assignees: ["KD"],
      },
      {
        title: "Sprint planning",
        description: "Balance capacity, set stretch goals, and confirm owners.",
        tag: "Ops",
        due: "Thu",
        assignees: ["LW"],
      },
    ],
  },
  {
    title: "Review",
    count: 2,
    accent: "bg-indigo-500",
    tasks: [
      {
        title: "Prototype walkthrough",
        description: "Share clickable demo with stakeholders for feedback.",
        tag: "Product",
        due: "Fri",
        assignees: ["MP", "JB"],
      },
      {
        title: "Analytics dashboard",
        description: "Validate KPI definitions and event naming conventions.",
        tag: "Data",
        due: "Fri",
        assignees: ["AR"],
      },
    ],
  },
  {
    title: "Done",
    count: 5,
    accent: "bg-emerald-500",
    tasks: [
      {
        title: "Team kickoff",
        description: "Introduced goals, timelines, and cross-functional leads.",
        tag: "People",
        due: "Done",
        assignees: ["JB"],
      },
      {
        title: "Research ops setup",
        description: "Centralized transcripts, tagging, and permissions.",
        tag: "Ops",
        due: "Done",
        assignees: ["LW"],
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Proactify Workspace
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Product Launch Kanban
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/50 hover:text-white">
                Share
              </button>
              <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                New Task
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              8 Active members
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2">
              Next sync: Thursday, 10:00 AM
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2">
              Sprint ends in 6 days
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-4">
          {boardColumns.map((column) => (
            <div
              key={column.title}
              className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${column.accent}`} />
                  <h2 className="text-lg font-semibold">{column.title}</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {column.count}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {column.tasks.map((task) => (
                  <article
                    key={task.title}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {task.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {task.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/70">
                        {task.due}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                        {task.tag}
                      </span>
                      <div className="flex -space-x-2">
                        {task.assignees.map((assignee) => (
                          <span
                            key={`${task.title}-${assignee}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-gradient-to-br from-slate-500 to-slate-700 text-xs font-semibold"
                          >
                            {assignee}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
