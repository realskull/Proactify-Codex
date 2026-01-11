"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Crown,
  Flame,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useDroppable } from "@dnd-kit/core";

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

type Task = {
  id: string;
  title: string;
  description: string;
  tag: string;
  due: string;
  assignees: string[];
};

type Column = {
  id: string;
  title: string;
  accent: string;
  tasks: Task[];
};

type DragData =
  | {
      type: "column";
      columnId: string;
    }
  | {
      type: "task";
      taskId: string;
      columnId: string;
    };

const initialColumns: Column[] = [
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

const badgeData = [
  {
    title: "Consistency Champion",
    description: "14-day streak",
    icon: Flame,
  },
  {
    title: "Night Owl",
    description: "10pm - 5am sessions",
    icon: Sparkles,
  },
  {
    title: "Task Crusher",
    description: "100% tasks done",
    icon: BadgeCheck,
  },
  {
    title: "Level 12",
    description: "XP 8,450",
    icon: Crown,
  },
];

function buildTaskAssignees(value: string) {
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => name.slice(0, 2).toUpperCase())
    .slice(0, 3);
}

function getColumnByTaskId(columns: Column[], taskId: string) {
  return columns.find((column) => column.tasks.some((task) => task.id === taskId));
}

function TaskCard({
  task,
  columnId,
  onMove,
  onDelete,
}: {
  task: Task;
  columnId: string;
  onMove: (taskId: string, direction: "left" | "right") => void;
  onDelete: (taskId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", taskId: task.id, columnId } satisfies DragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-4 rounded-2xl border border-border bg-bg p-4 shadow-sm transition-shadow ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      }`}
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
      <div className="flex flex-wrap justify-between gap-2">
        <button
          type="button"
          onClick={() => onMove(task.id, "left")}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-text transition hover:border-text"
        >
          <ArrowLeft size={14} /> Move left
        </button>
        <button
          type="button"
          onClick={() => onMove(task.id, "right")}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-text transition hover:border-text"
        >
          Move right <ArrowRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-rose-400 transition hover:border-rose-400"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
      <button
        type="button"
        className="cursor-grab text-xs text-text-muted"
        {...attributes}
        {...listeners}
      >
        Drag card
      </button>
    </article>
  );
}

function ColumnCard({
  column,
  isEditing,
  onEditStart,
  onEditSave,
  onDelete,
  onAddTask,
  children,
}: {
  column: Column;
  isEditing: boolean;
  onEditStart: () => void;
  onEditSave: (value: string) => void;
  onDelete: () => void;
  onAddTask: () => void;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", columnId: column.id } satisfies DragData,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className={`flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 transition-shadow ${
        isDragging ? "opacity-60 shadow-xl" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${column.accent}`} />
          {isEditing ? (
            <input
              autoFocus
              defaultValue={column.title}
              onBlur={(event) => onEditSave(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onEditSave((event.target as HTMLInputElement).value);
                }
              }}
              className="w-32 rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            />
          ) : (
            <button
              type="button"
              onClick={onEditStart}
              className="text-left text-lg font-semibold text-text"
            >
              {column.title}
            </button>
          )}
        </div>
        <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-text">
          {column.tasks.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-text-muted">
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-full border border-border px-3 py-1 transition hover:border-text"
        >
          + Add task
        </button>
        <button
          type="button"
          onClick={onEditStart}
          className="rounded-full border border-border px-3 py-1 transition hover:border-text"
        >
          Rename
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-border px-3 py-1 text-rose-400 transition hover:border-rose-400"
        >
          Delete column
        </button>
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>Drag handle</span>
        <button
          type="button"
          className="cursor-grab rounded-full border border-border px-3 py-1"
          {...attributes}
          {...listeners}
        >
          Drag column
        </button>
      </div>
      {children}
    </section>
  );
}

function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" });
  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-6 text-sm font-medium transition ${
        isOver
          ? "border-rose-400 bg-rose-500/10 text-rose-400"
          : "border-border text-text-muted"
      }`}
    >
      <Trash2 size={18} /> Drop here to delete
    </div>
  );
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState(tagOptions[0]);
  const [due, setDue] = useState("Today");
  const [assignees, setAssignees] = useState("AR");
  const [columnId, setColumnId] = useState(initialColumns[0].id);
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [boardTitle, setBoardTitle] = useState("Product Launch Kanban");
  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  function handleDeleteTask(taskId: string) {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }))
    );
  }

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      title: title.trim(),
      description: description.trim() || "No description yet.",
      tag,
      due,
      assignees: buildTaskAssignees(assignees),
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

  function handleAddTaskToColumn(targetColumnId: string) {
    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      title: "New task",
      description: "Add details for this task.",
      tag: tagOptions[0],
      due: "This week",
      assignees: ["AR"],
    };

    setColumns((prev) =>
      prev.map((column) =>
        column.id === targetColumnId
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column
      )
    );
  }

  function handleAddColumn() {
    const newColumn: Column = {
      id: `column-${crypto.randomUUID()}`,
      title: "New Stage",
      accent: "bg-sky-400",
      tasks: [],
    };

    setColumns((prev) => [...prev, newColumn]);
  }

  function handleDeleteColumn(columnIdToRemove: string) {
    setColumns((prev) => prev.filter((column) => column.id !== columnIdToRemove));
  }

  function handleRenameColumn(columnIdToRename: string, titleValue: string) {
    const nextTitle = titleValue.trim() || "Untitled";
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnIdToRename ? { ...column, title: nextTitle } : column
      )
    );
    setEditingColumnId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const data = (event.active.data.current as DragData | undefined) ?? null;
    setActiveDrag(data);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeData = active.data.current as DragData | undefined;
    const overData = over.data.current as DragData | undefined;

    if (!activeData || activeData.type !== "task") return;
    if (over.id === "trash") return;

    setColumns((prev) => {
      const sourceColumn = getColumnByTaskId(prev, activeData.taskId);
      if (!sourceColumn) return prev;
      const sourceIndex = prev.findIndex((column) => column.id === sourceColumn.id);
      const sourceTaskIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeData.taskId
      );
      if (sourceTaskIndex === -1) return prev;

      if (overData?.type === "task") {
        const destinationColumn = getColumnByTaskId(prev, overData.taskId);
        if (!destinationColumn) return prev;
        const destinationIndex = prev.findIndex(
          (column) => column.id === destinationColumn.id
        );
        const destinationTaskIndex = destinationColumn.tasks.findIndex(
          (task) => task.id === overData.taskId
        );

        if (sourceIndex === destinationIndex) {
          const updatedTasks = arrayMove(
            sourceColumn.tasks,
            sourceTaskIndex,
            destinationTaskIndex
          );
          return prev.map((column, index) =>
            index === sourceIndex ? { ...column, tasks: updatedTasks } : column
          );
        }

        const movedTask = sourceColumn.tasks[sourceTaskIndex];
        const nextSourceTasks = sourceColumn.tasks.filter(
          (task) => task.id !== activeData.taskId
        );
        const nextDestinationTasks = [...destinationColumn.tasks];
        nextDestinationTasks.splice(destinationTaskIndex, 0, movedTask);

        return prev.map((column, index) => {
          if (index === sourceIndex) {
            return { ...column, tasks: nextSourceTasks };
          }
          if (index === destinationIndex) {
            return { ...column, tasks: nextDestinationTasks };
          }
          return column;
        });
      }

      if (overData?.type === "column") {
        const destinationIndex = prev.findIndex(
          (column) => column.id === overData.columnId
        );
        if (destinationIndex === -1 || destinationIndex === sourceIndex) return prev;

        const movedTask = sourceColumn.tasks[sourceTaskIndex];
        const nextSourceTasks = sourceColumn.tasks.filter(
          (task) => task.id !== activeData.taskId
        );
        const destinationColumn = prev[destinationIndex];
        const nextDestinationTasks = [...destinationColumn.tasks, movedTask];

        return prev.map((column, index) => {
          if (index === sourceIndex) {
            return { ...column, tasks: nextSourceTasks };
          }
          if (index === destinationIndex) {
            return { ...column, tasks: nextDestinationTasks };
          }
          return column;
        });
      }

      return prev;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveDrag(null);
      return;
    }

    const activeData = active.data.current as DragData | undefined;
    const overData = over.data.current as DragData | undefined;

    if (activeData?.type === "column" && overData?.type === "column") {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((column) => column.id === activeData.columnId);
        const newIndex = prev.findIndex((column) => column.id === overData.columnId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    if (activeData?.type === "task") {
      if (over.id === "trash") {
        handleDeleteTask(activeData.taskId);
      }
    }

    setActiveDrag(null);
  }

  const activeTask =
    activeDrag?.type === "task"
      ? columns
          .flatMap((column) => column.tasks)
          .find((task) => task.id === activeDrag.taskId)
      : null;
  const activeColumn =
    activeDrag?.type === "column"
      ? columns.find((column) => column.id === activeDrag.columnId)
      : null;

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Proactify Workspace
            </p>
            {isEditingBoardTitle ? (
              <input
                autoFocus
                value={boardTitle}
                onChange={(event) => setBoardTitle(event.target.value)}
                onBlur={() => setIsEditingBoardTitle(false)}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-xl font-semibold text-text"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingBoardTitle(true)}
                className="text-left text-2xl font-semibold text-text md:text-3xl"
              >
                {boardTitle}
              </button>
            )}
            <p className="mt-2 text-sm text-text-muted">
              Drag columns, reorder cards, and drop tasks into the trash when they are done.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition hover:border-text">
              Share
            </button>
            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <Plus size={16} /> New column
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1.2fr]">
          <div className="flex flex-wrap gap-3 text-xs text-text-muted">
            <span className="rounded-full bg-surface-alt px-3 py-1">8 active members</span>
            <span className="rounded-full bg-surface-alt px-3 py-1">Next sync: Thu, 10:00 AM</span>
            <span className="rounded-full bg-surface-alt px-3 py-1">Sprint ends in 6 days</span>
          </div>
          <div className="rounded-2xl border border-border bg-bg/60 p-4">
            <div className="flex items-center justify-between text-sm text-text">
              <span className="font-semibold">Level 12</span>
              <span className="text-text-muted">8,450 / 10,000 XP</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-alt">
              <div className="h-full w-[82%] rounded-full bg-primary" />
            </div>
            <div className="mt-4 grid gap-2">
              {badgeData.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="font-semibold">{badge.title}</p>
                        <p className="text-text-muted">{badge.description}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-surface-alt px-2 py-1 text-[10px] text-text-muted">
                      Earned
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext items={columns.map((column) => column.id)}>
          <section className="grid gap-6 lg:grid-cols-4">
            {columns.map((column) => (
              <ColumnCard
                key={column.id}
                column={column}
                isEditing={editingColumnId === column.id}
                onEditStart={() => setEditingColumnId(column.id)}
                onEditSave={(value) => handleRenameColumn(column.id, value)}
                onDelete={() => handleDeleteColumn(column.id)}
                onAddTask={() => handleAddTaskToColumn(column.id)}
              >
                <SortableContext
                  items={column.tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-4">
                    {column.tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        columnId={column.id}
                        onMove={handleMove}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                </SortableContext>
              </ColumnCard>
            ))}
          </section>
        </SortableContext>

        <div className="mt-6">
          <TrashZone />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-72 rounded-2xl border border-border bg-bg p-4 shadow-xl">
              <p className="text-sm font-semibold text-text">{activeTask.title}</p>
              <p className="mt-2 text-sm text-text-muted">{activeTask.description}</p>
            </div>
          ) : null}
          {activeColumn ? (
            <div className="w-72 rounded-3xl border border-border bg-surface p-5 shadow-xl">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${activeColumn.accent}`} />
                <p className="text-sm font-semibold text-text">{activeColumn.title}</p>
              </div>
              <p className="mt-2 text-xs text-text-muted">{activeColumn.tasks.length} tasks</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
