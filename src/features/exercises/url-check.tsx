"use client";
import { useState } from "react";
import { Button } from "@shared/ui/button";
import type { UrlCheckExercise } from "@shared/types/content";

type UrlCheckProps = {
  exercise: UrlCheckExercise;
  onAnswer: (correct: boolean) => void;
};

export function UrlCheckExerciseComponent({ exercise, onAnswer }: UrlCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<"ok" | "danger" | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: "ok" | "danger") => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const correct = answer === exercise.answer;
    setTimeout(() => onAnswer(correct), 1500);
  };

  const isCorrect = selectedAnswer === exercise.answer;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{exercise.prompt}</h3>
        {exercise.hint && !showResult && (
          <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-200 dark:border-blue-800">
            💡 {exercise.hint}
          </div>
        )}
      </div>

      {/* URL Display */}
      <div className="bg-secondary/30 p-6 rounded-lg border-2 border-border space-y-3">
        <div className="text-sm text-muted-foreground font-mono">Отображаемый текст:</div>
        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 break-all">
          {exercise.visibleText}
        </div>
        <div className="border-t pt-3">
          <div className="text-sm text-muted-foreground font-mono mb-1">Реальная ссылка (href):</div>
          <div className="text-sm font-mono bg-background p-3 rounded border break-all">
            {exercise.href}
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      {!showResult && (
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleAnswer("ok")}
          >
            ✓ Безопасно
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="flex-1"
            onClick={() => handleAnswer("danger")}
          >
            ✗ Опасно
          </Button>
        </div>
      )}

      {/* Feedback */}
      {showResult && (
        <div
          className={`p-4 rounded-lg border-2 animate-in fade-in slide-in-from-bottom-3 ${
            isCorrect
              ? "bg-green-50 dark:bg-green-950 border-green-500 text-green-900 dark:text-green-100"
              : "bg-red-50 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-100"
          }`}
        >
          <div className="font-semibold mb-2 text-lg">
            {isCorrect ? "✓ Правильно!" : "✗ Неверно"}
          </div>
          {exercise.explanation && (
            <div className="text-sm">{exercise.explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}
