export const gameClockSlice = (set, get) => ({
  startGameClock() {
    const players = get().players;
    if (!players?.length) return;

    const scores = {};
    const targets = {};
    players.forEach((p) => {
      scores[p.id] = 1;
      targets[p.id] = 1;
    });

    set({
      scores,
      targetsClock: targets,
      gameType: "clock",
      status: "in_progress",
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      winnerId: null,
      finishedAt: null,
      finishedIds: [],
      podium: [],
      history: [],
      checkoutHint: null,
      turnStartScore: 0,
      gameStartedAt: Date.now(),
      gameFinishedAt: null,
      finishTimes: {},
      hasLoggedSession: false,
    });
  },

  throwDartClock({ value, mult }) {
    const s = get();
    if (s.status !== "in_progress" && s.status !== "win_pending") return;

    const prev = get().snapshot();
    let { playerIndex, dartIndex } = s.turn;
    const players = s.players.slice();
    const p = players[playerIndex];
    if (!p) return;

    const finished = new Set(s.finishedIds || []);
    const podium = Array.isArray(s.podium) ? s.podium.slice() : [];
    const targets = { ...(s.targetsClock || {}) };
    const scores = { ...(s.scores || {}) };
    const lastTurns = { ...(s.lastTurns || {}) };
    const finishTimes = { ...(s.finishTimes || {}) };

    const currentTarget = targets[p.id];
    const t = { value: value ?? 0, mult: mult ?? 1 };

    let nextTarget = currentTarget;

    if (typeof currentTarget === "number") {
      if (t.value === currentTarget) {
        const product = t.value * (t.mult || 1);
        let nt = product <= 20 ? product + 1 : t.value + 1;
        if (nt > 20) {
          nextTarget = "DANY";
          scores[p.id] = "D";
        } else {
          nextTarget = nt;
          scores[p.id] = nt;
        }
      }
    } else if (currentTarget === "DANY") {
      if (t.mult === 2 && t.value !== 0) {
        nextTarget = "TANY";
        scores[p.id] = "T";
      }
    } else if (currentTarget === "TANY") {
      if (t.mult === 3 && t.value !== 0) {
        nextTarget = "BULL3";
        scores[p.id] = "Bx3";
      }
    } else if (
      currentTarget === "BULL3" ||
      currentTarget === "BULL2" ||
      currentTarget === "BULL1"
    ) {
      if (t.value === 25) {
        const need =
          currentTarget === "BULL3" ? 3 : currentTarget === "BULL2" ? 2 : 1;
        const hits = t.mult === 2 ? 2 : 1;
        const remain = need - hits;
        if (remain <= 0) {
          const now = Date.now();
          const ctNow = [...(s.currentThrows || []), t];
          lastTurns[p.id] = ctNow.slice();
          set({
            status: "win_pending",
            winnerId: p.id,
            finishedAt: now,
            currentThrows: ctNow,
            lastTurns,
            finishTimes: { ...finishTimes, [p.id]: now },
            history: [...(s.history || []), prev].slice(-50),
          });
          const g = get();
          if (!g.hasLoggedSession && g.finalizeWinner) {
            g.finalizeWinner(p.id);
          }
          return;
        } else if (remain === 2) {
          nextTarget = "BULL2";
          scores[p.id] = "Bx2";
        } else {
          nextTarget = "BULL1";
          scores[p.id] = "Bull";
        }
      }
    }

    const ct = (s.currentThrows || []).slice();
    ct.push({ value: t.value, mult: t.mult });

    const nextDartIndex = dartIndex + 1;
    let nextPlayerIndex = playerIndex;

    if (nextTarget !== currentTarget) {
      targets[p.id] = nextTarget;
      if (typeof nextTarget === "number") scores[p.id] = nextTarget;
      if (nextTarget === "DANY") scores[p.id] = "D";
      if (nextTarget === "TANY") scores[p.id] = "T";
      if (nextTarget === "BULL3") scores[p.id] = "B3";
      if (nextTarget === "BULL2") scores[p.id] = "B2";
      if (nextTarget === "BULL1") scores[p.id] = "B1";
      if (nextTarget === "DONE") scores[p.id] = "-";
    }

    const endTurn = nextDartIndex >= 3;

    if (endTurn) {
      lastTurns[p.id] = ct.slice();
      const n = players.length;
      for (let i = 1; i <= n; i++) {
        const idx = (playerIndex + i) % n;
        const pid = players[idx]?.id;
        if (pid && !finished.has(pid)) {
          nextPlayerIndex = idx;
          break;
        }
      }
    }

    const allFinished = players.every(
      (pl) => finished.has(pl.id) || targets[pl.id] === "DONE"
    );

    const nextState = {
      targetsClock: targets,
      scores,
      lastTurns,
      currentThrows: endTurn ? [] : ct,
      turn: endTurn
        ? { playerIndex: nextPlayerIndex, dartIndex: 0 }
        : { playerIndex, dartIndex: nextDartIndex },
      finishedIds: Array.from(finished),
      podium,
      finishTimes,
    };

    set({
      history: [...(s.history || []), prev].slice(-50),
      ...nextState,
    });

    if (allFinished) {
      const now = Date.now();
      set({
        status: "finished",
        gameFinishedAt: now,
      });
    }
  },
  continueForPlacementsClock() {
    const s = get();
    if (s.status !== "win_pending" || !s.winnerId) return;

    const finished = new Set(s.finishedIds || []);
    if (!finished.has(s.winnerId)) finished.add(s.winnerId);

    const podium = Array.isArray(s.podium) ? s.podium.slice() : [];
    if (!podium.includes(s.winnerId)) podium.push(s.winnerId);

    const aliveCount = s.players.filter((p) => !finished.has(p.id)).length;
    if (aliveCount <= 1) {
      const now = Date.now();
      set({
        status: "finished",
        winnerId: podium[0] || s.winnerId,
        podium,
        currentThrows: [],
        gameFinishedAt: now,
      });
      return;
    }

    const n = s.players.length;
    let nextIndex = s.turn.playerIndex;
    for (let i = 1; i <= n; i++) {
      const idx = (s.turn.playerIndex + i) % n;
      const pid = s.players[idx]?.id;
      if (pid && !finished.has(pid)) {
        nextIndex = idx;
        break;
      }
    }

    set({
      finishedIds: Array.from(finished),
      podium,
      status: "in_progress",
      winnerId: null,
      currentThrows: [],
      turn: { playerIndex: nextIndex, dartIndex: 0 },
    });
  },
});
