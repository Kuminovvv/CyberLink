"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";

export default function ModulePage() {
  const { trackId, moduleId } = useParams<{ trackId: string; moduleId: string }>();
  const [index, setIndex] = useState<ContentIndex | null>(null);
  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);
  if (!index) return <main className="p-6">Загрузка…</main>;
  const mod = index.modules[moduleId];
  if (!mod) return <main className="p-6">Модуль не найден</main>;
  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{mod.title}</h1>
      <ul className="list-disc pl-6">
        {mod.units.map((uId) => (
          <li key={uId}><Link className="underline" href={`/learn/${trackId}/${moduleId}/${uId}`}>{index.units[uId]?.title ?? uId}</Link></li>
        ))}
      </ul>
    </main>
  );
}

