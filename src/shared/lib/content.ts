import type { ContentIndex, Lesson } from "@shared/types/content";

export async function fetchIndex(): Promise<ContentIndex> {
  const res = await fetch("/content/index.json", { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to load content index");
  return res.json();
}

export async function fetchLesson(pathOrId: string, index?: ContentIndex): Promise<Lesson> {
  const path = pathOrId.endsWith(".json")
    ? pathOrId
    : index?.lessons[pathOrId] ?? `/content/lessons/${pathOrId}.json`;
  const res = await fetch(path, { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to load lesson");
  return res.json();
}

