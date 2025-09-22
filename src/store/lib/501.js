export function isDoubleThrow(t) {
  if (!t) return false;
  if (t.value === 25 && t.mult === 2) return true;
  return t.mult === 2 && t.value >= 1 && t.value <= 20;
}

export function throwPoints(t) {
  if (!t) return 0;
  if (t.value === 0) return 0;
  if (t.value === 25) return t.mult === 2 ? 50 : 25;
  return (t.value || 0) * (t.mult || 1);
}

export function nextAlivePlayerIndex(players, curIndex, finishedSet) {
  let idx = curIndex;
  let safety = 0;
  do {
    idx = (idx + 1) % players.length;
    safety++;
    if (safety > players.length + 5) break;
  } while (finishedSet.has(players[idx].id));
  return idx;
}
