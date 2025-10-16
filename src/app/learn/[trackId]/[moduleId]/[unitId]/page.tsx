"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";

export default function UnitPage() {
  const { trackId, moduleId, unitId } = useParams<{ trackId: string; moduleId: string; unitId: string }>();
  const [index, setIndex] = useState<ContentIndex | null>(null);
  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);
  if (!index) return <main className="p-6">Загрузка…</main>;
  const unit = index.units[unitId];
  if (!unit) return <main className="p-6">Юнит не найден</main>;
  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{unit.title}</h1>
      <ul className="list-disc pl-6">
        {unit.lessons.map((lId) => (
          <li key={lId}><Link className="underline" href={`/lesson/${lId}`}>Открыть урок {lId}</Link></li>
        ))}
      </ul>
      <Link className="underline" href={`/learn/${trackId}/${moduleId}`}>← Назад к модулю</Link>
    </main>
  );
}

