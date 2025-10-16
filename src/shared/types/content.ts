export type ExerciseType =
  | "phishing_inbox"
  | "url_check"
  | "password_builder"
  | "mfa_flow"
  | "privacy_settings"
  | "https_chain"
  | "sqli_lite"
  | "incident_branching"
  | "generic";

export type GenericChoice = {
  id: string;
  text: string;
  correct?: boolean;
};

export type ExerciseBase = {
  id: string;
  type: ExerciseType;
  prompt: string;
  tags?: string[];
  hint?: string;
  explanation?: string;
  difficulty?: number; // 1..5
};

export type UrlCheckExercise = ExerciseBase & {
  type: "url_check";
  visibleText: string;
  href: string;
  answer: "ok" | "danger";
};

export type GenericExercise = ExerciseBase & {
  type: "generic";
  layout: "single" | "multiple" | "order" | "true_false" | "short_input";
  choices?: GenericChoice[];
  answer?: string | string[] | boolean;
};

export type Exercise = UrlCheckExercise | GenericExercise | ExerciseBase;

export type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  title: string;
  crown: number; // 0..5
  lessons: string[]; // lesson ids
};

export type Module = {
  id: string;
  title: string;
  units: string[]; // unit ids
};

export type Track = {
  id: string;
  title: string;
  description?: string;
  modules: string[]; // module ids
};

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  tags?: string[];
};

export type ContentIndex = {
  tracks: Track[];
  modules: Record<string, Module>;
  units: Record<string, Unit>;
  lessons: Record<string, string>; // id -> path
  glossary: GlossaryTerm[];
};

export type Settings = {
  language: "ru" | "en";
  theme: "light" | "dark" | "system";
  authoring: boolean;
};

export type Inventory = {
  hearts: number;
  coins: number;
  crowns: Record<string, number>; // unitId -> crowns 0..5
};

export type DailyXP = { date: string; xp: number };

export type Progress = {
  xp: number;
  streak: number;
  lastActiveDate?: string;
  completedLessons: Record<string, boolean>;
  weakTags: Record<string, number>; // tag -> mistakes count
  daily: DailyXP[];
};

