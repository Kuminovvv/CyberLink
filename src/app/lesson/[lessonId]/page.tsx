"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@shared/ui/button";
import { fetchIndex, fetchLesson } from "@shared/lib/content";
import type { ContentIndex, Exercise, Lesson } from "@shared/types/content";
import { loadInventory, loadProgress, saveInventory, saveProgress } from "@shared/lib/storage";
import {
  UrlCheckExerciseComponent,
  GenericExerciseComponent,
} from "@features";

function ExerciseView({ ex, onResult }: { ex: Exercise; onResult: (ok: boolean, tag?: string) => void }) {
  if (ex.type === "url_check") {
    return (
      <UrlCheckExerciseComponent
        exercise={ex}
        onAnswer={(correct) => onResult(correct, ex.tags?.[0])}
      />
    );
  }

  if (ex.type === "generic") {
    return (
      <GenericExerciseComponent
        exercise={ex}
        onAnswer={(correct) => onResult(correct, ex.tags?.[0])}
      />
    );
  }

  // Fallback for unsupported exercise types
  return (
    <div className="space-y-3">
      <p className="font-medium text-muted-foreground">
        Тип упражнения {ex.type} пока не поддерживается
      </p>
    </div>
  );
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [i, setI] = useState(0);
  const ex = useMemo(() => (lesson ? lesson.exercises[i] : undefined), [lesson, i]);

  useEffect(() => {
    fetchIndex().then(setIndex).catch(() => setIndex(null));
  }, []);
  useEffect(() => {
    fetchLesson(lessonId).then(setLesson).catch(() => setLesson(null));
  }, [lessonId]);

  if (!lesson) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="animate-spin text-4xl">⏳</div>
        <p className="text-muted-foreground">Загрузка урока...</p>
      </div>
    </main>
  );

  function onResult(ok: boolean, tag?: string) {
    const prog = loadProgress();
    const inv = loadInventory();
    if (ok) {
      prog.xp += 10;
      const today = new Date().toISOString().slice(0, 10);
      const existingDay = prog.daily.find((d) => d.date === today);
      if (existingDay) {
        existingDay.xp += 10;
      } else {
        prog.daily.push({ date: today, xp: 10 });
      }
    } else {
      inv.hearts = Math.max(0, inv.hearts - 1);
      if (tag) prog.weakTags[tag] = (prog.weakTags[tag] ?? 0) + 1;
    }
    saveProgress(prog);
    saveInventory(inv);

    if (ok) {
      if (i + 1 < lesson.exercises.length) {
        setI(i + 1);
      } else {
        const p = loadProgress();
        p.completedLessons[lesson.id] = true;
        saveProgress(p);
        // Show completion screen for a moment
        setTimeout(() => router.push("/learn"), 1500);
      }
    }
  }

  const progress = ((i / lesson.exercises.length) * 100).toFixed(0);
  const isCompleted = i >= lesson.exercises.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold">{lesson.title}</h1>
            <span className="text-sm text-muted-foreground">
              {i + 1} / {lesson.exercises.length}
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {!isCompleted ? (
          <div className="bg-card rounded-xl border shadow-lg p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
            {ex ? <ExerciseView ex={ex} onResult={onResult} /> : null}
          </div>
        ) : (
          <div className="text-center space-y-6 animate-in fade-in zoom-in">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold">Урок завершён!</h2>
            <p className="text-muted-foreground">
              Вы получили {lesson.exercises.length * 10} XP
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/learn")}
              className="mt-4"
            >
              Вернуться к обучению
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

