// XP, streak, hearts logic
import { updateStore, get, set } from '../utils/storage.js';

export function calcXp(diff, tryNo, hints, timeMs, targetP95 = 15000) {
  const base = 10 * (diff === 1 ? 1.0 : diff === 2 ? 1.5 : 2.0);
  const tryMult = tryNo === 1 ? 1.0 : tryNo === 2 ? 0.6 : 0.3;
  const timeBonus = timeMs <= targetP95 ? 1.1 : 1.0;
  const hintMult = Math.max(0.1, 1 - 0.15 * (hints || 0));
  return Math.round(base * tryMult * timeBonus * hintMult);
}

export function grantXp(delta, ctx = {}) {
  if (!delta) return;
  updateStore((s) => {
    s.user = s.user || {};
    s.user.xpTotal = (s.user.xpTotal || 0) + delta;
    s.ledger = s.ledger || [];
    s.ledger.push({ id: crypto.randomUUID?.() || Date.now(), type: 'xp', delta, ctx, ts: new Date().toISOString() });
    return s;
  });
}

export function consumeHeart() {
  const hearts = get('user.balances.hearts', 5);
  if (hearts <= 0) return false;
  set('user.balances.hearts', hearts - 1);
  return true;
}

export function restoreHeart() {
  const hearts = get('user.balances.hearts', 0);
  set('user.balances.hearts', Math.min(5, hearts + 1));
}

export function updateStreak(completedToday, allowFreeze = true) {
  const streak = get('user.streak', { days: 0, lastCheckInAt: null });
  const today = new Date().toDateString();
  const last = streak.lastCheckInAt ? new Date(streak.lastCheckInAt).toDateString() : null;
  let usedFreeze = false;
  if (completedToday) {
    const days = last === today ? streak.days : streak.days + 1;
    set('user.streak', { days, lastCheckInAt: new Date().toISOString() });
    return { days, usedFreeze };
  }
  // No completion today: freeze placeholder (coins check could be here)
  if (allowFreeze) usedFreeze = true;
  return { days: streak.days, usedFreeze };
}

