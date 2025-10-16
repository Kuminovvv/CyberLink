"use client";
import { useEffect, useState, useMemo } from "react";
import { loadInventory, loadProgress } from "@shared/lib/storage";
import type { Inventory, Progress } from "@shared/types/content";
import { Button } from "@shared/ui/button";

export default function ProfilePage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(loadProgress());
    setInventory(loadInventory());
  }, []);

  const last7Days = useMemo(() => {
    if (!progress) return [];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const dayData = progress.daily.find((d) => d.date === dateStr);
      days.push({
        date: dateStr,
        xp: dayData?.xp || 0,
        label: date.toLocaleDateString("ru", { weekday: "short" }),
      });
    }
    return days;
  }, [progress]);

  const maxXP = useMemo(() => {
    return Math.max(...last7Days.map((d) => d.xp), 1);
  }, [last7Days]);

  const totalCrowns = useMemo(() => {
    if (!inventory) return 0;
    return Object.values(inventory.crowns).reduce((sum, val) => sum + val, 0);
  }, [inventory]);

  if (!mounted || !progress || !inventory) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </main>
    );
  }

  const completedLessonsCount = Object.keys(progress.completedLessons).length;

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Ваш профиль</h1>
        <p className="text-muted-foreground">
          Отслеживайте свой прогресс и достижения
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
            {progress.xp}
          </div>
          <div className="text-sm text-amber-600 dark:text-amber-400">
            Всего XP
          </div>
        </div>

        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
            {progress.streak}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">
            Дней подряд
          </div>
        </div>

        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-3xl font-bold text-red-700 dark:text-red-300">
            {inventory.hearts}
          </div>
          <div className="text-sm text-red-600 dark:text-red-400">
            Жизни
          </div>
        </div>

        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <div className="text-3xl mb-2">🪙</div>
          <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
            {inventory.coins}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-400">
            Монеты
          </div>
        </div>
      </div>

      {/* XP Chart for last 7 days */}
      <div className="p-6 rounded-lg border-2 bg-card space-y-4">
        <h2 className="text-xl font-bold">Активность за неделю</h2>
        <div className="flex items-end justify-between gap-2 h-40">
          {last7Days.map((day) => {
            const height = (day.xp / maxXP) * 100;
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full relative flex items-end justify-center h-32">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-cyan-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: day.xp > 0 ? "8px" : "0" }}
                    title={`${day.xp} XP`}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {day.label}
                </div>
                <div className="text-xs font-semibold">{day.xp}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 rounded-lg border-2 bg-card">
          <h2 className="text-xl font-bold mb-4">Достижения</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <div className="font-semibold">Уроков пройдено</div>
                <div className="text-sm text-muted-foreground">
                  {completedLessonsCount} уроков
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl">👑</div>
              <div>
                <div className="font-semibold">Всего корон</div>
                <div className="text-sm text-muted-foreground">
                  {totalCrowns} корон
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-semibold">Слабых мест</div>
                <div className="text-sm text-muted-foreground">
                  {Object.keys(progress.weakTags).length} тем
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border-2 bg-gradient-to-br from-primary/10 to-cyan-500/10">
          <h2 className="text-xl font-bold mb-4">Мотивация</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {progress.streak > 0
                ? `Отличная серия! Вы занимаетесь уже ${progress.streak} ${
                    progress.streak === 1 ? "день" : "дней"
                  } подряд.`
                : "Начните заниматься прямо сейчас, чтобы запустить серию!"}
            </p>
            {progress.streak >= 7 && (
              <div className="p-3 rounded-md bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700">
                <div className="font-semibold text-amber-900 dark:text-amber-100">
                  🏆 Недельная серия!
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  Вы занимаетесь уже неделю подряд
                </div>
              </div>
            )}
            {completedLessonsCount >= 5 && (
              <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700">
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  📚 Первые 5 уроков!
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  Отличное начало!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

