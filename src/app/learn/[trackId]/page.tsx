"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const [index, setIndex] = useState<ContentIndex | null>(null);
  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);
  if (!index) return <main className="p-6">Загрузка…</main>;
  const track = index.tracks.find((t) => t.id === trackId);
  if (!track) return <main className="p-6">Трек не найден</main>;
  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{track.title}</h1>
      <ul className="list-disc pl-6">
        {track.modules.map((mId) => (
          <li key={mId}><Link className="underline" href={`/learn/${track.id}/${mId}`}>{index.modules[mId]?.title ?? mId}</Link></li>
        ))}
      </ul>
    </main>
  );
}

