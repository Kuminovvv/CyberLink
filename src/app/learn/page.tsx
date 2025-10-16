"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";

export default function LearnPage() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);
  if (!index) return <main className="p-6">Загрузка…</main>;
  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Дерево навыков</h1>
      <section className="space-y-3">
        {index.tracks.map((t) => (
          <div key={t.id} className="border p-3 rounded">
            <h2 className="font-semibold">{t.title}</h2>
            <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
            <Link className="underline" href={`/learn/${t.id}`}>Открыть трек</Link>
          </div>
        ))}
      </section>
    </main>
  );
}

