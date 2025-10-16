import type { Inventory, Progress, Settings } from "@shared/types/content";

const LS_KEYS = {
  settings: "cyberlink:settings",
  progress: "cyberlink:progress",
  inventory: "cyberlink:inventory",
} as const;

export function loadSettings(): Settings {
  if (typeof window === "undefined")
    return { language: "ru", theme: "system", authoring: false };
  try {
    const raw = localStorage.getItem(LS_KEYS.settings);
    if (!raw) return { language: "ru", theme: "system", authoring: false };
    return JSON.parse(raw);
  } catch {
    return { language: "ru", theme: "system", authoring: false };
  }
}

export function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.settings, JSON.stringify(s));
}

export function loadProgress(): Progress {
  if (typeof window === "undefined")
    return {
      xp: 0,
      streak: 0,
      completedLessons: {},
      weakTags: {},
      daily: [],
    };
  try {
    const raw = localStorage.getItem(LS_KEYS.progress);
    if (!raw)
      return {
        xp: 0,
        streak: 0,
        completedLessons: {},
        weakTags: {},
        daily: [],
      };
    return JSON.parse(raw);
  } catch {
    return {
      xp: 0,
      streak: 0,
      completedLessons: {},
      weakTags: {},
      daily: [],
    };
  }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.progress, JSON.stringify(p));
}

export function loadInventory(): Inventory {
  if (typeof window === "undefined")
    return { hearts: 5, coins: 0, crowns: {} };
  try {
    const raw = localStorage.getItem(LS_KEYS.inventory);
    if (!raw) return { hearts: 5, coins: 0, crowns: {} };
    return JSON.parse(raw);
  } catch {
    return { hearts: 5, coins: 0, crowns: {} };
  }
}

export function saveInventory(i: Inventory) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.inventory, JSON.stringify(i));
}

export function exportAll(): string {
  const dump = {
    settings: loadSettings(),
    progress: loadProgress(),
    inventory: loadInventory(),
  };
  return JSON.stringify(dump, null, 2);
}

export function importAll(json: string) {
  const data = JSON.parse(json);
  if (data.settings) saveSettings(data.settings);
  if (data.progress) saveProgress(data.progress);
  if (data.inventory) saveInventory(data.inventory);
}

