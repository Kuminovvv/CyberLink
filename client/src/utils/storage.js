// Simple JSON storage wrapper over localStorage with namespacing
const NS = 'cyberlingo.v1';

export function getStore() {
  const raw = localStorage.getItem(NS);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export function setStore(obj) {
  localStorage.setItem(NS, JSON.stringify(obj));
}

export function updateStore(mutator) {
  const current = getStore();
  const next = mutator(structuredClone(current));
  setStore(next);
  return next;
}

export function get(path, fallback) {
  const obj = getStore();
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return fallback;
    cur = cur[p];
  }
  return cur == null ? fallback : cur;
}

export function set(path, value) {
  updateStore((s) => {
    const parts = path.split('.');
    let cur = s;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = parts[i];
      cur[k] = cur[k] ?? {};
      cur = cur[k];
    }
    cur[parts[parts.length - 1]] = value;
    return s;
  });
}

export function uid(prefix = 'id') {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${t}_${r}`;
}

