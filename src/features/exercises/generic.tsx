"use client";
import { useState } from "react";
import { Button } from "@shared/ui/button";
import type { GenericExercise } from "@shared/types/content";

type GenericExerciseProps = {
  exercise: GenericExercise;
  onAnswer: (correct: boolean) => void;
};

export function GenericExerciseComponent({ exercise, onAnswer }: GenericExerciseProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    let correct = false;

    if (exercise.layout === "true_false") {
      // Для true/false проверяем напрямую через кнопки
      return;
    } else if (exercise.layout === "single") {
      correct = selected[0] === (exercise.answer as string);
    } else if (exercise.layout === "multiple") {
      const answers = exercise.answer as string[];
      correct =
        selected.length === answers.length &&
        selected.every((s) => answers.includes(s));
    } else if (exercise.layout === "short_input") {
      const answer = exercise.answer as string;
      correct = inputValue.trim().toLowerCase() === answer.toLowerCase();
    }

    setShowResult(true);
    setTimeout(() => onAnswer(correct), 1500);
  };

  const handleTrueFalse = (value: boolean) => {
    const correct = value === exercise.answer;
    setShowResult(true);
    setSelected([String(value)]);
    setTimeout(() => onAnswer(correct), 1500);
  };

  const toggleChoice = (id: string) => {
    if (exercise.layout === "single") {
      setSelected([id]);
    } else {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    }
  };

  const isCorrect = () => {
    if (exercise.layout === "true_false") {
      return selected[0] === String(exercise.answer);
    } else if (exercise.layout === "single") {
      return selected[0] === exercise.answer;
    } else if (exercise.layout === "multiple") {
      const answers = exercise.answer as string[];
      return (
        selected.length === answers.length &&
        selected.every((s) => answers.includes(s))
      );
    }
    return false;
  };

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

      {/* True/False */}
      {exercise.layout === "true_false" && !showResult && (
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => handleTrueFalse(true)}
          >
            ✓ Истина
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="flex-1"
            onClick={() => handleTrueFalse(false)}
          >
            ✗ Ложь
          </Button>
        </div>
      )}

      {/* Single/Multiple Choice */}
      {(exercise.layout === "single" || exercise.layout === "multiple") && (
        <>
          <div className="space-y-2">
            {exercise.choices?.map((choice) => {
              const isSelected = selected.includes(choice.id);
              return (
                <button
                  type="button"
                  key={choice.id}
                  onClick={() => !showResult && toggleChoice(choice.id)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-background"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{choice.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {!showResult && (
            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={selected.length === 0}
            >
              Проверить ответ
            </Button>
          )}
        </>
      )}

      {/* Short Input */}
      {exercise.layout === "short_input" && (
        <>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={showResult}
            placeholder="Введите ваш ответ..."
            className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:border-primary focus:outline-none"
          />
          {!showResult && (
            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
            >
              Проверить ответ
            </Button>
          )}
        </>
      )}

      {/* Feedback */}
      {showResult && (
        <div
          className={`p-4 rounded-lg border-2 animate-in fade-in slide-in-from-bottom-3 ${
            isCorrect()
              ? "bg-green-50 dark:bg-green-950 border-green-500 text-green-900 dark:text-green-100"
              : "bg-red-50 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-100"
          }`}
        >
          <div className="font-semibold mb-2 text-lg">
            {isCorrect() ? "✓ Правильно!" : "✗ Неверно"}
          </div>
          {exercise.explanation && (
            <div className="text-sm">{exercise.explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}
