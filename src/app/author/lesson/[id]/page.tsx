"use client";
import { useParams } from "next/navigation";

export default function AuthorLessonPreviewPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Превью урока</h1>
      <p>Черновик: {id}</p>
      <p>В MVP предпросмотр подключится к локальному JSON.</p>
    </main>
  );
}

