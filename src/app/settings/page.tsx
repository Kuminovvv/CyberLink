"use client";
import { useEffect, useState } from "react";
import { Button } from "@shared/ui/button";
import { exportAll, importAll, loadSettings, saveSettings } from "@shared/lib/storage";

export default function SettingsPage() {
  const [lang, setLang] = useState<"ru" | "en">("ru");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [author, setAuthor] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setLang(s.language); setTheme(s.theme); setAuthor(s.authoring);
  }, []);

  function save() {
    saveSettings({ language: lang, theme, authoring: author });
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }

  function onExport() {
    const data = exportAll();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cyberlink-export.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    f.text().then((txt) => importAll(txt));
  }

  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Язык</span>
          <select aria-label="Язык" className="border rounded px-3 py-2 w-full" value={lang} onChange={(e)=>setLang(e.target.value as any)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm">Тема</span>
          <select aria-label="Тема" className="border rounded px-3 py-2 w-full" value={theme} onChange={(e)=>setTheme(e.target.value as any)}>
            <option value="system">Системная</option>
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input aria-label="Режим авторинга" type="checkbox" checked={author} onChange={(e)=>setAuthor(e.target.checked)} />
          Включить авторинг (локально)
        </label>
      </div>
      <div className="flex gap-2">
        <Button onClick={save}>Сохранить</Button>
        <Button variant="secondary" onClick={onExport}>Экспорт JSON</Button>
        <label className="inline-flex items-center gap-2">
          <span className="sr-only">Импорт JSON</span>
          <input aria-label="Импорт JSON" type="file" accept="application/json" onChange={onImport} />
        </label>
      </div>
    </main>
  );
}

