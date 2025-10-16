"use client";
import { useState } from "react";
import { Button } from "@shared/ui/button";

export default function NewLessonPage() {
  const [title, setTitle] = useState("");
  const [json, setJson] = useState("{
  \"id\": \"draft-1\",
  \"title\": \"Новый урок\",
  \"durationMin\": 5,
  \"exercises\": []
}");

  function preview() {
    try {
      JSON.parse(json);
      alert("JSON валиден. Сохранение в проект не поддерживается в MVP. Экспортируйте JSON.");
    } catch {
      alert("Ошибка JSON");
    }
  }

  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Новый урок (черновик)</h1>
      <label className="space-y-1 block">
        <span className="text-sm">Название</span>
        <input aria-label="Название урока" value={title} onChange={(e)=>setTitle(e.target.value)} className="border rounded px-3 py-2 w-full" />
      </label>
      <label className="space-y-1 block">
        <span className="text-sm">JSON</span>
        <textarea aria-label="JSON урока" value={json} onChange={(e)=>setJson(e.target.value)} className="border rounded px-3 py-2 w-full min-h-64 font-mono" />
      </label>
      <div className="flex gap-2">
        <Button onClick={preview}>Проверить</Button>
      </div>
    </main>
  );
}

