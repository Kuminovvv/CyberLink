"use client";
import Link from "next/link";
import { loadSettings } from "@shared/lib/storage";

export default function AuthorPage() {
  const s = loadSettings();
  if (!s.authoring) {
    return (
      <main className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Авторинг выключен</h1>
        <p>Включите режим авторинга в настройках, чтобы создавать черновики.</p>
      </main>
    );
  }
  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Автор</h1>
      <p>
        <Link className="underline" href="/author/lesson/new">Создать урок</Link>
      </p>
    </main>
  );
}

