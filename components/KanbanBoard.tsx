"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChevronDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
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

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string;
  tag: string;
  due: string;
  assignees: string[];
  checklist: ChecklistItem[];
  progress: number;
  deadline: string;
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
        checklist: [
          { id: "task-1-check-1", label: "Draft personas", done: true },
          { id: "task-1-check-2", label: "Capture pain points", done: false },
          { id: "task-1-check-3", label: "Share summary", done: false },
        ],
        progress: 40,
        deadline: "2026-02-12",
      },
      {
        id: "task-2",
        title: "Competitive teardown",
        description: "Summarize positioning and pricing gaps across top rivals.",
        tag: "Strategy",
        due: "Tue",
        assignees: ["LW"],
        checklist: [
          { id: "task-2-check-1", label: "Pricing matrix", done: true },
          { id: "task-2-check-2", label: "Feature gaps", done: true },
          { id: "task-2-check-3", label: "Recommendation", done: false },
        ],
        progress: 65,
        deadline: "2026-02-14",
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
        checklist: [
          { id: "task-3-check-1", label: "Spacing inventory", done: true },
          { id: "task-3-check-2", label: "Color tokens", done: false },
        ],
        progress: 55,
        deadline: "2026-02-10",
      },
      {
        id: "task-4",
        title: "Onboarding copy refresh",
        description: "Rewrite the activation email and tutorial scripts.",
        tag: "Content",
        due: "Wed",
        assignees: ["KD"],
        checklist: [
          { id: "task-4-check-1", label: "Email draft", done: true },
          { id: "task-4-check-2", label: "In-app copy", done: false },
        ],
        progress: 35,
        deadline: "2026-02-18",
      },
      {
        id: "task-5",
        title: "Sprint planning",
        description: "Balance capacity, set stretch goals, and confirm owners.",
        tag: "Ops",
        due: "Thu",
        assignees: ["LW"],
        checklist: [
          { id: "task-5-check-1", label: "Capacity review", done: true },
          { id: "task-5-check-2", label: "Goal setting", done: false },
          { id: "task-5-check-3", label: "Assign owners", done: false },
        ],
        progress: 20,
        deadline: "2026-02-16",
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
        checklist: [
          { id: "task-6-check-1", label: "Record demo", done: true },
          { id: "task-6-check-2", label: "Collect notes", done: false },
        ],
        progress: 70,
        deadline: "2026-02-11",
      },
      {
        id: "task-7",
        title: "Analytics dashboard",
        description: "Validate KPI definitions and event naming conventions.",
        tag: "Data",
        due: "Fri",
        assignees: ["AR"],
        checklist: [
          { id: "task-7-check-1", label: "Review metrics", done: true },
          { id: "task-7-check-2", label: "Confirm owners", done: false },
        ],
        progress: 50,
        deadline: "2026-02-15",
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
        checklist: [
          { id: "task-8-check-1", label: "Stakeholders aligned", done: true },
          { id: "task-8-check-2", label: "Schedule published", done: true },
        ],
        progress: 100,
        deadline: "2026-02-05",
      },
      {
        id: "task-9",
        title: "Research ops setup",
        description: "Centralized transcripts, tagging, and permissions.",
        tag: "Ops",
        due: "Done",
        assignees: ["LW"],
        checklist: [
          { id: "task-9-check-1", label: "Archive cleanup", done: true },
          { id: "task-9-check-2", label: "Access review", done: true },
        ],
        progress: 100,
        deadline: "2026-02-02",
      },
    ],
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
  isExpanded,
  checklistDraft,
  onToggleExpanded,
  onChecklistToggle,
  onChecklistAdd,
  onChecklistDraftChange,
  onProgressChange,
  onDeadlineChange,
}: {
  task: Task;
  columnId: string;
  isExpanded: boolean;
  checklistDraft: string;
  onToggleExpanded: () => void;
  onChecklistToggle: (taskId: string, itemId: string) => void;
  onChecklistAdd: (taskId: string) => void;
  onChecklistDraftChange: (taskId: string, value: string) => void;
  onProgressChange: (taskId: string, value: number) => void;
  onDeadlineChange: (taskId: string, value: string) => void;
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
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">{task.title}</p>
          <p className="mt-2 text-sm text-text-muted">{task.description}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpanded();
          }}
          className="rounded-full border border-border p-2 text-text-muted transition hover:border-text"
        >
          <MoreHorizontal size={16} />
        </button>
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
      {isExpanded ? (
        <div
          className="rounded-xl border border-border bg-surface px-3 py-3 text-xs text-text"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">Checklist</span>
            <span className="text-text-muted">{task.checklist.length} items</span>
          </div>
          <div className="mt-2 space-y-2">
            {task.checklist.map((item) => (
              <label key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onChecklistToggle(task.id, item.id)}
                />
                <span className={item.done ? "line-through text-text-muted" : "text-text"}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={checklistDraft}
              onChange={(event) => onChecklistDraftChange(task.id, event.target.value)}
              placeholder="Add checklist item"
              className="flex-1 rounded-lg border border-border bg-bg px-2 py-1 text-xs"
            />
            <button
              type="button"
              onClick={() => onChecklistAdd(task.id)}
              className="rounded-lg border border-border px-2 py-1 text-xs"
            >
              Add
            </button>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">Progress</span>
              <span className="text-text-muted">{task.progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={task.progress}
              onChange={(event) => onProgressChange(task.id, Number(event.target.value))}
              className="mt-2 w-full"
            />
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold">Due date</label>
            <input
              type="date"
              value={task.deadline}
              onChange={(event) => onDeadlineChange(task.id, event.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-bg px-2 py-1 text-xs"
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ColumnCard({
  column,
  isEditing,
  onEditStart,
  onEditSave,
  onAddTask,
  children,
}: {
  column: Column;
  isEditing: boolean;
  onEditStart: () => void;
  onEditSave: (value: string) => void;
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
    resize: "horizontal" as const,
    overflow: "auto" as const,
  };

  return (
    <section
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className={`flex min-h-[220px] flex-col gap-4 rounded-3xl border border-border bg-surface p-5 transition-shadow ${
        isDragging ? "opacity-60 shadow-xl" : "hover:shadow-md"
      }`}
      {...attributes}
      {...listeners}
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
              onClick={(event) => event.stopPropagation()}
              className="w-36 rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
            />
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEditStart();
              }}
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
          onClick={(event) => {
            event.stopPropagation();
            onAddTask();
          }}
          className="rounded-full border border-border px-3 py-1 transition hover:border-text"
        >
          + Add task
        </button>
      </div>
      {children}
    </section>
  );
}

function TrashZone({ active }: { active: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" });
  if (!active) return null;

  return (
    <div
      ref={setNodeRef}
      className={`fixed right-6 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2 rounded-2xl border border-dashed px-4 py-4 text-sm font-medium transition ${
        isOver
          ? "border-rose-400 bg-rose-500/10 text-rose-400"
          : "border-border bg-bg text-text-muted"
      }`}
    >
      <Trash2 size={18} /> Drop to delete
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
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [checklistDrafts, setChecklistDrafts] = useState<Record<string, string>>({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columnOptions = useMemo(
    () => columns.map((column) => ({ id: column.id, title: column.title })),
    [columns]
  );

  function handleDeleteTask(taskId: string) {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }))
    );
  }

  function handleDeleteColumn(columnIdToRemove: string) {
    setColumns((prev) => prev.filter((column) => column.id !== columnIdToRemove));
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
      checklist: [],
      progress: 0,
      deadline: "",
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
      checklist: [],
      progress: 0,
      deadline: "",
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

  function handleRenameColumn(columnIdToRename: string, titleValue: string) {
    const nextTitle = titleValue.trim() || "Untitled";
    setColumns((prev) =>
      prev.map((column) =>
        column.id === columnIdToRename ? { ...column, title: nextTitle } : column
      )
    );
    setEditingColumnId(null);
  }

  function updateTask(taskId: string, updater: (task: Task) => Task) {
    setColumns((prev) =>
      prev.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) => (task.id === taskId ? updater(task) : task)),
      }))
    );
  }

  function handleChecklistToggle(taskId: string, itemId: string) {
    updateTask(taskId, (task) => ({
      ...task,
      checklist: task.checklist.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      ),
    }));
  }

  function handleChecklistDraftChange(taskId: string, value: string) {
    setChecklistDrafts((prev) => ({ ...prev, [taskId]: value }));
  }

  function handleChecklistAdd(taskId: string) {
    const label = checklistDrafts[taskId]?.trim();
    if (!label) return;
    updateTask(taskId, (task) => ({
      ...task,
      checklist: [
        ...task.checklist,
        { id: `${taskId}-${crypto.randomUUID()}`, label, done: false },
      ],
    }));
    setChecklistDrafts((prev) => ({ ...prev, [taskId]: "" }));
  }

  function handleProgressChange(taskId: string, value: number) {
    updateTask(taskId, (task) => ({ ...task, progress: value }));
  }

  function handleDeadlineChange(taskId: string, value: string) {
    updateTask(taskId, (task) => ({ ...task, deadline: value }));
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

    if (activeData?.type === "task" && over.id === "trash") {
      handleDeleteTask(activeData.taskId);
    }

    if (activeData?.type === "column" && over.id === "trash") {
      handleDeleteColumn(activeData.columnId);
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
              Drag cards between columns, resize panels, and drop items into the trash to delete.
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-text"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold">
                  MJ
                </span>
                <ChevronDown size={16} />
              </button>
              {profileMenuOpen ? (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-bg p-3 text-xs text-text shadow-lg">
                  <p className="font-semibold">Mina Johnson</p>
                  <p className="text-text-muted">Level 12 • 8,450 XP</p>
                  <div className="mt-3 rounded-xl bg-surface px-3 py-2">
                    <p className="text-[10px] uppercase text-text-muted">Next level</p>
                    <p className="text-sm font-semibold">1,550 XP to Level 13</p>
                  </div>
                </div>
              ) : null}
            </div>
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

      <div
        className="rounded-3xl border border-border bg-surface p-6"
        style={{ resize: "both", overflow: "auto" }}
      >
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
                          isExpanded={expandedTaskId === task.id}
                          checklistDraft={checklistDrafts[task.id] ?? ""}
                          onToggleExpanded={() =>
                            setExpandedTaskId((prev) => (prev === task.id ? null : task.id))
                          }
                          onChecklistToggle={handleChecklistToggle}
                          onChecklistAdd={handleChecklistAdd}
                          onChecklistDraftChange={handleChecklistDraftChange}
                          onProgressChange={handleProgressChange}
                          onDeadlineChange={handleDeadlineChange}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </ColumnCard>
              ))}
            </section>
          </SortableContext>

          <TrashZone active={Boolean(activeDrag)} />

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

    </div>
  );
}
