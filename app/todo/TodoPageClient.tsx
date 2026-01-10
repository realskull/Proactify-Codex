"use client";

import { useEffect, useState } from "react";
import TodoList from "@/components/TodoList";
import { createClient } from "@/utils/supabase/client";

export default function TodoPageClient() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<any[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTasks([]);
        return;
      }

      setUserId(user.id);

      // *** 👇 THIS WAS MISSING AND IS WHY ORDER WAS NOT PERSISTING ***
      const { data, error } = await supabase
        .from("todo_items")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true }); // 🔥 REQUIRED

      if (error) console.error("FETCH ERROR:", error);

      setTasks(data || []);
    }

    load();
  }, []);

  if (!tasks) {
    return (
      <p className="text-dark text-center mt-8">
        Loading your tasks…
      </p>
    );
  }

  if (!userId) {
    return (
      <p className="text-dark text-center mt-8">
        You must log in to use your to-do list.
      </p>
    );
  }

  return <TodoList initialTasks={tasks} userId={userId} />;
}

