"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";

const initialColumns = [
  {
    id: "backlog",
    title: "Backlog",
    accent: "bg-rose-400",
    tasks: [
      {
        id: "task-1",
        title: "Customer journey mapping",
        description: "Align on personas and success metrics for the Q2 launch.",
        tag: "Research",
        due: "Mon",
        assignees: ["AR", "KD"],
      },
      {
        id: "task-2",
        title: "Competitive teardown",
        description: "Summarize positioning and pricing gaps across top rivals.",
        tag: "Strategy",
        due: "Tue",
        assignees: ["LW"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    accent: "bg-amber-400",
    tasks: [
      {
        id: "task-3",
        title: "Design system audit",
        description: "Catalog component inconsistencies and propose cleanups.",
        tag: "Design",
        due: "Today",
        assignees: ["MP", "AR"],
      },
      {
        id: "task-4",
        title: "Onboarding copy refresh",
        description: "Rewrite the activation email and tutorial scripts.",
        tag: "Content",
        due: "Wed",
        assignees: ["KD"],
      },
      {
        id: "task-5",
        title: "Sprint planning",
        description: "Balance capacity, set stretch goals, and confirm owners.",
        tag: "Ops",
        due: "Thu",
        assignees: ["LW"],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    accent: "bg-indigo-400",
    tasks: [
      {
        id: "task-6",
        title: "Prototype walkthrough",
        description: "Share clickable demo with stakeholders for feedback.",
        tag: "Product",
        due: "Fri",
        assignees: ["MP", "JB"],
      },
      {
        id: "task-7",
        title: "Analytics dashboard",
        description: "Validate KPI definitions and event naming conventions.",
        tag: "Data",
        due: "Fri",
        assignees: ["AR"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    accent: "bg-emerald-400",
    tasks: [
      {
        id: "task-8",
        title: "Team kickoff",
        description: "Introduced goals, timelines, and cross-functional leads.",
        tag: "People",
        due: "Done",
        assignees: ["JB"],
      },
      {
        id: "task-9",
        title: "Research ops setup",
        description: "Centralized transcripts, tagging, and permissions.",
        tag: "Ops",
        due: "Done",
        assignees: ["LW"],
      },
    ],
  },
];

const tagOptions = [
  "Research",
  "Strategy",
  "Design",
  "Content",
  "Ops",
  "Product",
  "Data",
  "People",
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState(tagOptions[0]);
  const [due, setDue] = useState("Today");
  const [assignees, setAssignees] = useState("AR");
  const [columnId, setColumnId] = useState(initialColumns[0].id);

  const columnOptions = useMemo(
    () => columns.map((column) => ({ id: column.id, title: column.title })),
    [columns]
  );

  function handleMove(taskId: string, direction: "left" | "right") {
    setColumns((prev) => {
      const sourceIndex = prev.findIndex((column) =>
        column.tasks.some((task) => task.id === taskId)
      );
      if (sourceIndex === -1) return prev;

      const targetIndex = direction === "left" ? sourceIndex - 1 : sourceIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const task = prev[sourceIndex].tasks.find((item) => item.id === taskId);
      if (!task) return prev;

      return prev.map((column, index) => {
        if (index === sourceIndex) {
          return {
            ...column,
            tasks: column.tasks.filter((item) => item.id !== taskId),
          };
        }
        if (index === targetIndex) {
          return {
            ...column,
            tasks: [...column.tasks, task],
          };
        }
        return column;
      });
    });
  }

  function handleAddTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: `task-${crypto.randomUUID()}`,
      title: title.trim(),
      description: description.trim() || "No description yet.",
      tag,
      due,
      assignees: assignees
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => name.slice(0, 2).toUpperCase())
        .slice(0, 3),
    };

    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column
      )
    );

    setTitle("");
    setDescription("");
    setAssignees("AR");
    setDue("Today");
    setTag(tagOptions[0]);
    setColumnId(initialColumns[0].id);
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Proactify Workspace
            </p>
            <h1 className="text-2xl font-semibold text-text md:text-3xl">
              Product Launch Kanban
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Track the sprint pipeline, shift tasks across stages, and add new work.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition hover:border-text">
              Share
            </button>
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
              New Task
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-text-muted">
          <span className="rounded-full bg-surface-alt px-3 py-1">8 active members</span>
          <span className="rounded-full bg-surface-alt px-3 py-1">Next sync: Thu, 10:00 AM</span>
          <span className="rounded-full bg-surface-alt px-3 py-1">Sprint ends in 6 days</span>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text">Quick add</h2>
        <p className="mt-1 text-sm text-text-muted">
          Create a new task and drop it directly into any column.
        </p>
        <form
          className="mt-4 grid gap-4 md:grid-cols-[2fr_2fr_1fr_1fr]"
          onSubmit={handleAddTask}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-text-muted">
              Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add task title"
              className="rounded-xl border border-border bg-bg px-4 py-2 text-sm text-text outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-text-muted">
              Description
            </label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What needs to happen next?"
              className="rounded-xl border border-border bg-bg px-4 py-2 text-sm text-text outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-text-muted">
              Tag & Due
            </label>
            <div className="flex gap-2">
              <select
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text"
              >
                {tagOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                value={due}
                onChange={(event) => setDue(event.target.value)}
                className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-text-muted">
              Assign & Column
            </label>
            <div className="flex gap-2">
              <input
                value={assignees}
                onChange={(event) => setAssignees(event.target.value)}
                placeholder="AR, KD"
                className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text"
              />
              <select
                value={columnId}
                onChange={(event) => setColumnId(event.target.value)}
                className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-xs text-text"
              >
                {columnOptions.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <Plus size={16} /> Add task
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        {columns.map((column, columnIndex) => (
          <div
            key={column.id}
            className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${column.accent}`} />
                <h2 className="text-lg font-semibold text-text">{column.title}</h2>
              </div>
              <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-text">
                {column.tasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {column.tasks.map((task) => (
                <article
                  key={task.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-bg p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text">{task.title}</p>
                      <p className="mt-2 text-sm text-text-muted">{task.description}</p>
                    </div>
                    <span className="rounded-full bg-surface-alt px-2 py-1 text-xs font-medium text-text">
                      {task.due}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-semibold text-text">
                      {task.tag}
                    </span>
                    <div className="flex -space-x-2">
                      {task.assignees.map((assignee) => (
                        <span
                          key={`${task.id}-${assignee}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-bg bg-primary/20 text-xs font-semibold text-text"
                        >
                          {assignee}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleMove(task.id, "left")}
                      disabled={columnIndex === 0}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-text transition hover:border-text disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ArrowLeft size={14} /> Move left
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(task.id, "right")}
                      disabled={columnIndex === columns.length - 1}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-text transition hover:border-text disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move right <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
