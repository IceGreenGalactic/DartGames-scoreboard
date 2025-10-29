export const CRICKET_ORDER = ["20", "19", "18", "17", "16", "15", "BULL"];

export function marksFromHit(key, value, mult) {
  if (key === "BULL") return value === 25 ? (mult === 2 ? 2 : 1) : 0;
  const n = Number(key);
  if (value !== n) return 0;
  return mult === 3 ? 3 : mult === 2 ? 2 : 1;
}

export function allClosed(marksMap) {
  return CRICKET_ORDER.every((k) => (marksMap[k] || 0) >= 3);
}

export function opponentsOpen(players, marks, meId, key) {
  for (const pl of players) {
    if (pl.id !== meId && (marks[pl.id]?.[key] || 0) < 3) return true;
  }
  return false;
}
