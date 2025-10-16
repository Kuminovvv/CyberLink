"use client";
import { Button } from "@shared/ui/button";
import { useRouter } from "next/navigation";
import { loadProgress, saveProgress } from "@shared/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  function startPlacement() {
    const p = loadProgress();
    // Very lite placement: start at unit u1
    saveProgress({ ...p, completedLessons: p.completedLessons });
    router.push("/learn");
  }
  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Онбординг</h1>
      <p>Короткий плейсмент-тест подберет стартовый уровень.</p>
      <Button onClick={startPlacement}>Начать</Button>
    </main>
  );
}

