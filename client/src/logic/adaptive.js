// Simple adaptive difficulty and SRS update
export function nextDifficulty(accEMA = 0.75, lastDiff = 1, hintsUsed = 0, lastTimeFast = true) {
  let d = lastDiff;
  if (accEMA >= 0.85 && hintsUsed === 0 && lastTimeFast) d++;
  else if (accEMA <= 0.7 || hintsUsed >= 2) d--;
  return Math.max(1, Math.min(3, d));
}

export function srsUpdate(card, q) {
  const clamp = (min, v, max) => Math.max(min, Math.min(max, v));
  const ease = clamp(1.3, (card.ease ?? 2.5) + (0.1 - (4 - q) * 0.08), 2.8);
  let interval = card.intervalDays ?? 1;
  if (q < 3) {
    card.lapses = (card.lapses || 0) + 1;
    interval = 1;
  } else if (interval <= 1) {
    interval = 3;
  } else {
    interval = Math.round(interval * ease);
  }
  return { ...card, ease, intervalDays: interval, dueAt: new Date(Date.now() + interval * 86400000).toISOString() };
}

