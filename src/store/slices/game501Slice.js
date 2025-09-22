import { isDoubleThrow, throwPoints, nextAlivePlayerIndex } from "../lib/501";

export const game501Slice = (set, get) => ({
  startGame501() {
    const players = get().players;
    const scores = {};
    players.forEach((p) => (scores[p.id] = 501));
    set({
      scores,
      gameType: "501",
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      status: "in_progress",
      winnerId: null,
      finishedAt: null,
      history: [],
      turnStartScore: 501,
      finishedIds: [],
      podium: [],
      lastBustAt: 0,
    });
  },

  throwDart501({ value, mult }) {
    const s = get();
    if (s.status !== "in_progress") return;

    let pIndex = s.turn.playerIndex;
    let p = s.players[pIndex];
    if (!p) return;

    const finishedSet = new Set(s.finishedIds);
    let safe = 0;
    while (p && finishedSet.has(p.id) && safe < 100) {
      pIndex = (pIndex + 1) % s.players.length;
      p = s.players[pIndex];
      safe++;
    }
    if (!p) return;

    const prev = get().snapshot();
    const t = { value: value ?? 0, mult: mult ?? 1 };
    const newThrows = [...s.currentThrows, t];

    const startScore = s.turnStartScore || s.scores[p.id];
    const used = newThrows.reduce((sum, x) => sum + throwPoints(x), 0);
    const remain = startScore - used;

    const lastThrow = t;
    const bust =
      remain < 0 || remain === 1 || (remain === 0 && !isDoubleThrow(lastThrow));

    if (bust) {
      const nextPlayerIndex = nextAlivePlayerIndex(
        s.players,
        pIndex,
        finishedSet
      );
      const lastTurns = { ...s.lastTurns, [p.id]: [] };
      set({
        scores: { ...s.scores, [p.id]: startScore },
        currentThrows: [],
        lastTurns,
        turn: { playerIndex: nextPlayerIndex, dartIndex: 0 },
        turnStartScore: get().scores[s.players[nextPlayerIndex].id],
        history: [...s.history, prev].slice(-50),
        lastBustAt: Date.now(),
      });
      return;
    }

    if (remain === 0) {
      const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
      set({
        scores: { ...s.scores, [p.id]: 0 },
        currentThrows: newThrows,
        lastTurns,
        status: "win_pending",
        winnerId: p.id,
        finishedAt: Date.now(),
        history: [...s.history, prev].slice(-50),
      });
      return;
    }

    const nextDart = s.turn.dartIndex + 1;
    if (nextDart >= 3) {
      const newScore = startScore - used;
      const nextPlayerIndex = nextAlivePlayerIndex(s.players, pIndex, finishedSet);
      const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
      set({
        scores: { ...s.scores, [p.id]: newScore },
        currentThrows: [],
        lastTurns,
        turn: { playerIndex: nextPlayerIndex, dartIndex: 0 },
        turnStartScore: get().scores[s.players[nextPlayerIndex].id],
        history: [...s.history, prev].slice(-50),
      });
    } else {
      set({
        currentThrows: newThrows,
        turn: { ...s.turn, dartIndex: nextDart },
        history: [...s.history, prev].slice(-50),
      });
    }
  },

  continueForPlacements501() {
    const s = get();
    if (s.status !== "win_pending" || !s.winnerId) return;

    const finished = new Set(s.finishedIds);
    if (!finished.has(s.winnerId)) finished.add(s.winnerId);

    const podium = s.podium.includes(s.winnerId) ? s.podium : [...s.podium, s.winnerId];

    const aliveCount = s.players.filter((p) => !finished.has(p.id)).length;
    if (aliveCount <= 1) {
      const lastAlive = s.players.find((p) => !finished.has(p.id));
      const finalPodium = lastAlive && !podium.includes(lastAlive.id)
        ? [...podium, lastAlive.id]
        : podium;
      set({
        status: "finished",
        winnerId: finalPodium[0] || s.winnerId,
        podium: finalPodium,
        currentThrows: [],
      });
      return;
    }

    const nextIndex = nextAlivePlayerIndex(s.players, s.turn.playerIndex, finished);

    set({
      finishedIds: Array.from(finished),
      podium,
      status: "in_progress",
      winnerId: null,
      currentThrows: [],
      turn: { playerIndex: nextIndex, dartIndex: 0 },
      turnStartScore: get().scores[s.players[nextIndex].id],
    });
  },
});
