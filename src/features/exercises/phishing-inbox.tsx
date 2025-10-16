"use client";
import { useState } from "react";
import { Button } from "@shared/ui/button";
import type { ExerciseBase } from "@shared/types/content";

type PhishingEmail = {
  from: string;
  subject: string;
  preview: string;
  suspicious: boolean;
  indicators?: string[];
};

type PhishingInboxExercise = ExerciseBase & {
  type: "phishing_inbox";
  emails: PhishingEmail[];
};

type PhishingInboxProps = {
  exercise: PhishingInboxExercise;
  onAnswer: (correct: boolean) => void;
};

export function PhishingInboxExerciseComponent({
  exercise,
  onAnswer,
}: PhishingInboxProps) {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelectEmail = (index: number) => {
    if (showResult) return;
    setSelectedEmail(index);
  };

  const handleMarkSafe = () => {
    if (selectedEmail === null) return;
    const email = exercise.emails[selectedEmail];
    const correct = !email.suspicious;
    setShowResult(true);
    setTimeout(() => onAnswer(correct), 2000);
  };

  const handleMarkSuspicious = () => {
    if (selectedEmail === null) return;
    const email = exercise.emails[selectedEmail];
    const correct = email.suspicious;
    setShowResult(true);
    setTimeout(() => onAnswer(correct), 2000);
  };

  const selectedEmailData =
    selectedEmail !== null ? exercise.emails[selectedEmail] : null;

  const isCorrect =
    showResult &&
    selectedEmailData &&
    ((selectedEmailData.suspicious && showResult) ||
      (!selectedEmailData.suspicious && showResult));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{exercise.prompt}</h3>
        <p className="text-sm text-muted-foreground">
          Выберите письмо и определите, безопасно оно или подозрительно
        </p>
      </div>

      {/* Email List */}
      <div className="space-y-2">
        {exercise.emails.map((email, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleSelectEmail(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedEmail === index
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 bg-background"
            } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">📧</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{email.from}</div>
                <div className="font-medium text-base mt-1">{email.subject}</div>
                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {email.preview}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      {selectedEmail !== null && !showResult && (
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleMarkSafe}
          >
            ✓ Безопасно
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="flex-1"
            onClick={handleMarkSuspicious}
          >
            ⚠ Подозрительно
          </Button>
        </div>
      )}

      {/* Feedback */}
      {showResult && selectedEmailData && (
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
          {selectedEmailData.indicators && (
            <div className="space-y-1 text-sm">
              <div className="font-medium">Признаки фишинга:</div>
              <ul className="list-disc pl-5 space-y-1">
                {selectedEmailData.indicators.map((indicator, i) => (
                  <li key={i}>{indicator}</li>
                ))}
              </ul>
            </div>
          )}
          {exercise.explanation && (
            <div className="text-sm mt-3 pt-3 border-t border-current/20">
              {exercise.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
