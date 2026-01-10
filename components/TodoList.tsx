"use client";

import { useState, useEffect } from "react";
import { GripVertical, Trash2, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ============================================================
   SORTABLE TASK ROW
============================================================ */
function SortableTask({
  task,
  toggleTask,
  deleteTask,
  dragListeners,
  isOverlay,
}: any) {
  const sortable = useSortable({ id: task?.id });
  const { attributes, listeners, setNodeRef, transform, transition } =
    dragListeners ?? sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-surface border-2 border-border
        rounded-xl p-3 flex items-center justify-start
        text-text
        ${isOverlay ? "opacity-100 shadow-xl" : ""}
      `}
    >
      {/* LEFT SIDE */}
      <label
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={() => toggleTask(task.id, task.done)}
      >
        {/* Checkbox */}
        <div
          className={`
            w-6 h-6 border-2 rounded-md flex items-center justify-center
            ${task.done ? "bg-text border-text" : "bg-surface border-border"}
          `}
        >
          {task.done && (
            <Check size={16} strokeWidth={3} className="text-bg" />
          )}
        </div>

        <input
          type="checkbox"
          checked={task.done}
          readOnly
          className="hidden"
        />

        {/* Title */}
        <div className="relative flex-1 overflow-hidden -mt-1" style={{ minWidth: 0 }}>
          <span
            className={`
              block max-w-full flex-shrink
              ${task.done ? "line-through opacity-50" : ""}
            `}
            style={{
              hyphens: "auto",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {task.title}
          </span>
        </div>
      </label>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        {/* DELETE BUTTON */}
        <button
          onClick={() => deleteTask(task.id)}
          className="
            group cursor-pointer p-2 rounded-xl border-2
            bg-surface border-surface
            hover:bg-warning-bg hover:border-warning-border
          "
        >
          <Trash2 className="w-5 h-5 text-warning" />
        </button>

        {/* DRAG HANDLE */}
        <div
          {...attributes}
          {...listeners}
          className="
            cursor-grab active:cursor-grabbing p-2 rounded-xl border-2
            bg-surface border-surface
            hover:bg-surface-alt hover:border-border
          "
        >
          <GripVertical className="text-text opacity-70 w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN TODO LIST
============================================================ */
export default function TodoList({
  initialTasks,
  userId,
}: {
  initialTasks: any[];
  userId: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  /* ADD TASK */
  async function addTask() {
    if (!newTask.trim()) return;

    const newItem = {
      user_id: userId,
      title: newTask.trim(),
      done: false,
      position: tasks.length,
    };

    const { data, error } = await supabase
      .from("todo_items")
      .insert(newItem)
      .select()
      .single();

    if (!error) {
      setTasks([...tasks, data]);
      setNewTask("");
    }
  }

  /* TOGGLE DONE */
  async function toggleTask(id: string, done: boolean) {
    await supabase.from("todo_items").update({ done: !done }).eq("id", id);

    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !done } : t))
    );
  }

  /* DELETE TASK */
  async function deleteTask(id: string) {
    const filtered = tasks.filter((t) => t.id !== id);
    const reindexed = filtered.map((t, i) => ({ ...t, position: i }));

    setTasks(reindexed);

    await supabase.from("todo_items").delete().eq("id", id);

    await supabase.from("todo_items").upsert(
      reindexed.map((t) => ({
        id: t.id,
        position: t.position,
        user_id: userId,
      })),
      { onConflict: "id" }
    );
  }

  /* DRAG START */
  function handleDragStart(e: any) {
    setActiveId(e.active.id);
  }

  /* DRAG END */
  async function handleDragEnd(e: any) {
    const { active, over } = e;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    const newOrder = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newOrder);

    await supabase.from("todo_items").upsert(
      newOrder.map((t, index) => ({
        id: t.id,
        title: t.title,
        done: t.done,
        user_id: userId,
        position: index,
      })),
      { onConflict: "id" }
    );

    setActiveId(null);
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  /* MAIN RENDER */
  return (
    <div
      className="
        bg-surface border-2 border-border
        rounded-xl p-4 sm:p-6 
        flex flex-col gap-4 
        w-full max-w-[340px] mx-auto
        text-text
      "
    >
      {/* INPUT */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Write a task..."
          value={newTask}
          maxLength={80}
          onChange={(e) => setNewTask(e.target.value)}
          className="
            flex-1 bg-surface
            border-2 border-border
            rounded-xl p-3 outline-none
            text-text
            focus:border-blue
          "
        />

        <button
          onClick={addTask}
          className="
            bg-surface-alt text-text
            border-2 border-border
            px-4 py-3 rounded-xl
          "
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-3">
            {tasks.map((task) => (
              <SortableTask
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? (
            <SortableTask
              task={activeTask}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

