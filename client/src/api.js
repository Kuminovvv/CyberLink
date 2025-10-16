// Client-only mock API mapping to localStorage
import { getStore, setStore, updateStore, get, set, uid } from './utils/storage.js';
import { emptyUser } from './models.js';
import { seedData } from './data/seed.js';
import { calcXp, grantXp, consumeHeart, updateStreak } from './logic/gamification.js';

function ensureInit() {
  const s = getStore();
  if (!s.__inited) {
    const seed = seedData();
    setStore({
      __inited: true,
      user: emptyUser(),
      ...seed,
      attempts: [],
      srs: [],
      progress: { lessonsDone: {} },
      lastLesson: null,
      ledger: []
    });
  }
}

export async function apiBootstrap() {
  ensureInit();
  return getStore();
}

export async function apiGetMe() { ensureInit(); return get('user'); }

export async function apiPatchMe(patch) {
  return updateStore((s) => { s.user = { ...s.user, ...patch }; return s; }).user;
}

export async function apiGetTracks() { ensureInit(); return get('tracks', []); }
export async function apiGetLessonsByUnit(unitId) { ensureInit(); return getStore().lessons.filter(l => l.unitId === unitId); }
export async function apiGetUnitsByModule(moduleId) { ensureInit(); return getStore().units.filter(u => u.moduleId === moduleId); }
export async function apiGetModulesByCourse(courseId) { ensureInit(); return getStore().modules.filter(m => m.courseId === courseId); }
export async function apiGetCoursesByTrack(trackId) { ensureInit(); return getStore().courses.filter(c => c.trackId === trackId); }

export async function apiGetLesson(lessonId) { ensureInit(); return getStore().lessons.find(l => l.id === lessonId); }
export async function apiGetExercises(lessonId) { ensureInit(); return getStore().exercises.filter(e => e.lessonId === lessonId); }

export async function apiPostAttempt({ exerciseId, payload, idempotencyKey, clientTs }) {
  ensureInit();
  // Idempotency
  const prev = getStore().attempts.find(a => a.idempotencyKey === idempotencyKey);
  if (prev) return prev.response;

  const ex = getStore().exercises.find(e => e.id === exerciseId);
  if (!ex) throw new Error('NOT_FOUND');

  // Simple validation per type
  let correct = false; let score = 0; let hintsUsed = (payload?.hintsUsed)||0;
  if (ex.type === 'mcq') {
    const sel = new Set(payload?.selectedOptionIds || []);
    const corr = new Set(ex.solution.correctOptionIds || []);
    correct = corr.size === sel.size && [...corr].every(id => sel.has(id));
    const common = [...sel].filter(x => corr.has(x)).length;
    score = Math.max(0, Math.min(1, common / Math.max(1, corr.size)));
  } else if (ex.type === 'true_false') {
    correct = payload?.selectedOptionId === ex.solution.correctOptionId;
    score = correct ? 1 : 0;
  } else {
    // default: single choice
    correct = payload?.selectedOptionId === ex.solution.correctOptionId;
    score = correct ? 1 : 0;
  }

  // Hearts logic: consume on wrong
  let heartsDelta = 0;
  if (!correct) {
    const ok = consumeHeart();
    if (!ok) {
      const response = { error: { code: 'INSUFFICIENT_HEARTS', message: 'Нет сердец' } };
      // store idempotency fail result as well
      updateStore((s) => { s.attempts.push({ id: uid('att'), idempotencyKey, request: { exerciseId, payload }, response }); return s; });
      return response;
    }
    heartsDelta = -1;
  }

  // XP rewards
  const tryNo = 1; // since we have no per-ex state yet
  const timeMs = Math.max(1000, Math.min(60000, (Date.now() - (clientTs || Date.now()))));
  const xp = correct ? calcXp(ex.difficulty || 1, tryNo, hintsUsed, timeMs) : 0;
  if (xp) grantXp(xp, { exerciseId, lessonId: ex.lessonId, difficulty: ex.difficulty });

  // SRS card on error
  let srsCardCreated = false;
  if (!correct) {
    updateStore((s) => {
      s.srs = s.srs || [];
      s.srs.push({ id: uid('srs'), userId: s.user.id, source: 'exercise', refId: ex.id, ease: 2.5, intervalDays: 1, dueAt: new Date(Date.now()+86400000).toISOString(), lapses: 0, lastReviewAt: null, skillId: (ex.skills?.[0]||null) });
      return s;
    });
    srsCardCreated = true;
  }

  const response = {
    attemptId: uid('att'),
    result: correct ? 'correct' : (score > 0 ? 'partial' : 'wrong'),
    score,
    explanation: ex.explanation,
    nextHintAvailable: (ex.hints?.length || 0) > hintsUsed,
    deliveredDifficulty: ex.difficulty || 1,
    timeSpentMs: timeMs,
    rewards: { xp, coins: correct ? 0 : 0, heartsDelta },
    srsCardCreated
  };

  updateStore((s) => {
    s.attempts.push({ id: response.attemptId, idempotencyKey, request: { exerciseId, payload }, response, createdAt: new Date().toISOString() });
    s.lastLesson = ex.lessonId;
    return s;
  });
  return response;
}

export async function apiCompleteLesson(lessonId, { durationMs, accuracy }) {
  const progress = updateStore((s) => {
    s.progress = s.progress || { lessonsDone: {} };
    s.progress.lessonsDone[lessonId] = { durationMs, accuracy, completedAt: new Date().toISOString() };
    return s;
  }).progress;
  const streak = updateStreak(true);
  return { rewards: { xp: 20, crownsDeltaBySkill: {} }, streak, goalCompleted: true, progress };
}

export async function apiGetSrsQueue(limit = 10) {
  const now = Date.now();
  const all = get('srs', []);
  const due = all.filter(c => !c.dueAt || Date.parse(c.dueAt) <= now).slice(0, limit);
  return due;
}

export async function apiGetLeaderboard() {
  const user = get('user');
  return { period: 'current', entries: [{ rank: 1, nickname: user.nickname, xp: user.xpTotal }], me: { rank: 1, xp: user.xpTotal } };
}

export async function apiPreviewLesson(lessonId) {
  const lesson = await apiGetLesson(lessonId);
  const exercises = await apiGetExercises(lessonId);
  return { lesson, exercises };
}

// Authoring (simple): add MCQ to a lesson
export async function apiAuthorAddExercise(lessonId, data) {
  return updateStore((s) => {
    s.exercises.push({ id: uid('ex'), lessonId, ...data, status: 'draft', version: 1 });
    const idx = s.lessons.findIndex(l => l.id === lessonId);
    if (idx >= 0) s.lessons[idx].exerciseCount = (s.lessons[idx].exerciseCount || 0) + 1;
    return s;
  }).exercises.slice(-1)[0];
}

