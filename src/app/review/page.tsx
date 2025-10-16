"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadProgress } from "@shared/lib/storage";
import { fetchIndex } from "@shared/lib/content";
import type { ContentIndex } from "@shared/types/content";
import { Button } from "@shared/ui/button";

export default function ReviewPage() {
  const [progress, setProgress] = useState(loadProgress());
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const router = useRouter();

  useEffect(() => {
    setProgress(loadProgress());
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);

  const weakTags = useMemo(
    () =>
      Object.entries(progress.weakTags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    [progress]
  );

  const availableLessons = useMemo(() => {
    if (!index) return [];
    // Get all lessons from the index
    return Object.keys(index.lessons);
  }, [index]);

  const handlePractice = () => {
    if (availableLessons.length > 0) {
      // Pick a random lesson for practice
      const randomLesson =
        availableLessons[Math.floor(Math.random() * availableLessons.length)];
      router.push(`/lesson/${randomLesson}`);
    }
  };

  const completedCount = Object.keys(progress.completedLessons).length;
  const totalLessons = availableLessons.length;
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Повторение и практика</h1>
        <p className="text-muted-foreground">
          Укрепите свои знания, повторяя сложные темы
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 rounded-lg border-2 bg-card">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold">{completionPercentage}%</div>
          <div className="text-sm text-muted-foreground">
            Пройдено уроков ({completedCount}/{totalLessons})
          </div>
        </div>

        <div className="p-6 rounded-lg border-2 bg-card">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold">{weakTags.length}</div>
          <div className="text-sm text-muted-foreground">
            Тем для повторения
          </div>
        </div>

        <div className="p-6 rounded-lg border-2 bg-card">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold">{progress.xp}</div>
          <div className="text-sm text-muted-foreground">Всего XP</div>
        </div>
      </div>

      {/* Quick Practice Button */}
      <div className="p-6 rounded-lg border-2 bg-gradient-to-r from-primary/10 to-cyan-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Быстрая практика</h2>
            <p className="text-sm text-muted-foreground">
              Случайный урок для повторения
            </p>
          </div>
          <Button
            size="lg"
            onClick={handlePractice}
            disabled={availableLessons.length === 0}
          >
            Начать практику
          </Button>
        </div>
      </div>

      {/* Weak Areas */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Слабые места</h2>
        {weakTags.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border-2">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-2">
              Отличная работа!
            </h3>
            <p className="text-muted-foreground">
              У вас нет слабых мест. Продолжайте в том же духе!
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {weakTags.map(([tag, count]) => {
              const barWidth = Math.min((count / Math.max(...weakTags.map((w) => w[1]))) * 100, 100);
              return (
                <div
                  key={tag}
                  className="p-4 rounded-lg border-2 bg-card hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{tag}</div>
                    <div className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "ошибка" : "ошибок"}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="p-6 rounded-lg border-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Рекомендации</span>
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Повторяйте материал регулярно для лучшего запоминания</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Сосредоточьтесь на темах с наибольшим количеством ошибок</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Используйте глоссарий для изучения терминов</span>
          </li>
        </ul>
      </div>
    </main>
  );
}

