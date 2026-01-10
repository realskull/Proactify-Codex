import TodoPageClient from "./TodoPageClient";

export const metadata = {
  title: "Todo • Proactify",
};

export default function TodoPage() {
  return (
    <div
      className="
        min-h-screen p-6
        bg-bg
        text-text
      "
    >
      <div className="max-w-3xl mx-auto">
        <TodoPageClient />
      </div>
    </div>
  );
}

