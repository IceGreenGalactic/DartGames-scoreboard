// ---- RUNTIME HELPERS ----
export function initRuntime(get, set, gameType) {
  const s = get();
  const perPlayer = {};
  (s.players || []).forEach((p) => {
    perPlayer[p.id] = {
      name: p.name,
      darts: 0,
      turns: [],
      maxTurn: 0,
      busts: 0,
      doubles: 0,
      triples: 0,
      bulls: 0,
      doubleBulls: 0,
      "180s": 0,
      "140s": 0,
    };
  });
  set({
    runtime: {
      game: gameType,
      startedAt: Date.now(),
      perPlayer,
      events: [],
      highestCheckout: 0,
      dartsUsedToFinish: null,
    },
  });
}

export function rtOnThrow(
  get,
  set,
  { playerId, t, preScore = null, postScore = null, bust = false }
) {
  const rt = get().runtime;
  if (!rt) return;
  const pp = rt.perPlayer[playerId];
  if (!pp) return;
  pp.darts += 1;
  if (t.mult === 2 && t.value !== 25) pp.doubles += 1;
  if (t.mult === 3) pp.triples += 1;
  if (t.value === 25) {
    if (t.mult === 2) pp.doubleBulls += 1;
    else pp.bulls += 1;
  }
  rt.events.push({
    type: "throw",
    at: Date.now(),
    playerId,
    value: t.value,
    mult: t.mult,
    preScore,
    postScore,
    bust,
  });
  set({ runtime: { ...rt } });
}

export function rtOnTurnEnd(get, set, { playerId, turnScore }) {
  const rt = get().runtime;
  if (!rt) return;
  const pp = rt.perPlayer[playerId];
  if (!pp) return;
  pp.turns.push(turnScore);
  pp.maxTurn = Math.max(pp.maxTurn || 0, turnScore);
  if (turnScore === 180) pp["180s"] = (pp["180s"] || 0) + 1;
  if (turnScore >= 140) pp["140s"] = (pp["140s"] || 0) + 1;
  rt.events.push({ type: "turnEnd", at: Date.now(), playerId, turnScore });
  set({ runtime: { ...rt } });
}

export function rtOnBust(get, set, { playerId }) {
  const rt = get().runtime;
  if (!rt) return;
  const pp = rt.perPlayer[playerId];
  if (!pp) return;
  pp.busts += 1;
  rt.events.push({ type: "bust", at: Date.now(), playerId });
  set({ runtime: { ...rt } });
}

export function rtOnCheckout(get, set, { playerId, points }) {
  const rt = get().runtime;
  if (!rt) return;
  rt.highestCheckout = Math.max(rt.highestCheckout || 0, points || 0);
  const pp = rt.perPlayer[playerId];
  if (pp && !rt.dartsUsedToFinish) rt.dartsUsedToFinish = pp.darts;
  rt.events.push({ type: "checkout", at: Date.now(), playerId, points });
  set({ runtime: { ...rt } });
}

export function exportRuntime(get) {
  const s = get();
  const rt = s.runtime;
  if (!rt) return {};
  const nameOf = (id) => s.players.find((x) => x.id === id)?.name || id;
  const dartsPerPlayer = {};
  const bestTurnPerPlayer = {};
  const oneEightiesPerPlayer = {};
  const oneFortiesPerPlayer = {};
  const bustsPerPlayer = {};
  Object.entries(rt.perPlayer).forEach(([id, pp]) => {
    dartsPerPlayer[nameOf(id)] = pp.darts || 0;
    bestTurnPerPlayer[nameOf(id)] = pp.maxTurn || 0;
    oneEightiesPerPlayer[nameOf(id)] = pp["180s"] || 0;
    oneFortiesPerPlayer[nameOf(id)] = pp["140s"] || 0;
    bustsPerPlayer[nameOf(id)] = pp.busts || 0;
  });
  return {
    dartsPerPlayer,
    bestTurnPerPlayer,
    oneEightiesPerPlayer,
    oneFortiesPerPlayer,
    bustsPerPlayer,
    highestCheckout: rt.highestCheckout || 0,
    dartsUsedToFinish: rt.dartsUsedToFinish || null,
    ...(s.gameType === "killer" && s.kills ? { kills: { ...s.kills } } : {}),
  };
}
