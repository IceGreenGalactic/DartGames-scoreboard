import {
  isDoubleThrow,
  throwPoints,
  nextAlivePlayerIndex,
  findCheckout,
  formatRoute,
} from "../lib/501";
import { rtOnThrow, rtOnTurnEnd, rtOnBust, rtOnCheckout } from "../lib/runtime";

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
      gameStartedAt: Date.now(),
      gameFinishedAt: 0,
      finishTimes: {},
      checkoutHint: null,
      mustDoubleOut: true,
      x01Start: 501,
    });
    const s = get();
    const p = s.players[0];
    if (p) {
      const routes = findCheckout(501, 3);
      set({ checkoutHint: routes.length ? formatRoute(routes[0]) : null });
    }
  },

  startGame301() {
    const players = get().players;
    const scores = {};
    players.forEach((p) => (scores[p.id] = 301));
    set({
      scores,
      gameType: "301",
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      status: "in_progress",
      winnerId: null,
      finishedAt: null,
      history: [],
      turnStartScore: 301,
      finishedIds: [],
      podium: [],
      lastBustAt: 0,
      gameStartedAt: Date.now(),
      gameFinishedAt: 0,
      finishTimes: {},
      checkoutHint: null,
      mustDoubleOut: true,
      x01Start: 301,
    });
    const s = get();
    const p = s.players[0];
    if (p) {
      const routes = findCheckout(301, 3);
      set({ checkoutHint: routes.length ? formatRoute(routes[0]) : null });
    }
  },

  throwDart501({ value, mult }) {
    let s = get();
    if (s.status === "win_pending") {
      get().continueForPlacements501();
      s = get();
    }
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

    rtOnThrow(get, set, {
      playerId: p.id,
      t,
      preScore: startScore,
      postScore: remain,
      bust: false,
    });

    const lastThrow = t;
    const mustDouble = !!s.mustDoubleOut;
    const bust =
      remain < 0 ||
      (mustDouble && remain === 1) ||
      (mustDouble && remain === 0 && !isDoubleThrow(lastThrow));

    if (bust) {
      rtOnBust(get, set, { playerId: p.id });
      rtOnTurnEnd(get, set, { playerId: p.id, turnScore: 0 });

      const nextPlayerIndex = nextAlivePlayerIndex(
        s.players,
        pIndex,
        finishedSet,
      );
      const lastTurns = { ...s.lastTurns, [p.id]: [] };
      const nextPlayer = s.players[nextPlayerIndex];
      const nextScores = { ...s.scores, [p.id]: startScore };
      const nextStart = nextScores[nextPlayer.id];

      const routesNext =
        mustDouble && nextStart > 1 ? findCheckout(nextStart, 3) : [];
      set({
        scores: nextScores,
        currentThrows: [],
        lastTurns,
        turn: { playerIndex: nextPlayerIndex, dartIndex: 0 },
        turnStartScore: nextStart,
        history: [...s.history, prev].slice(-50),
        lastBustAt: Date.now(),
        checkoutHint: routesNext.length ? formatRoute(routesNext[0]) : null,
      });
      return;
    }

    if (remain === 0) {
      const now = Date.now();
      const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
      const finishTimes = { ...s.finishTimes, [p.id]: now };
      rtOnCheckout(get, set, { playerId: p.id, points: startScore });
      rtOnTurnEnd(get, set, {
        playerId: p.id,
        turnScore: newThrows.reduce(
          (s, x) =>
            s +
            (x.value === 25
              ? x.mult === 2
                ? 50
                : 25
              : (x.value || 0) * (x.mult || 1)),
          0,
        ),
      });

      set({
        scores: { ...s.scores, [p.id]: 0 },
        currentThrows: newThrows,
        lastTurns,
        status: "win_pending",
        winnerId: p.id,
        finishedAt: now,
        history: [...s.history, prev].slice(-50),
        finishTimes,
        checkoutHint: null,
      });
      return;
    }

    const dartsLeft = 3 - newThrows.length;
    const routesNow =
      mustDouble && dartsLeft > 0 && remain > 1
        ? findCheckout(remain, dartsLeft)
        : [];
    const nextDart = s.turn.dartIndex + 1;

    if (nextDart >= 3) {
      const newScore = startScore - used;
      const nextPlayerIndex = nextAlivePlayerIndex(
        s.players,
        pIndex,
        finishedSet,
      );
      const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
      const nextPlayer = s.players[nextPlayerIndex];
      const nextScores = { ...s.scores, [p.id]: newScore };
      const nextStart = nextScores[nextPlayer.id];
      const routesNext =
        mustDouble && nextStart > 1 ? findCheckout(nextStart, 3) : [];
      rtOnTurnEnd(get, set, {
        playerId: p.id,
        turnScore: newThrows.reduce(
          (s, x) =>
            s +
            (x.value === 25
              ? x.mult === 2
                ? 50
                : 25
              : (x.value || 0) * (x.mult || 1)),
          0,
        ),
      });

      set({
        scores: nextScores,
        currentThrows: [],
        lastTurns,
        turn: { playerIndex: nextPlayerIndex, dartIndex: 0 },
        turnStartScore: nextStart,
        history: [...s.history, prev].slice(-50),
        checkoutHint: routesNext.length ? formatRoute(routesNext[0]) : null,
      });
    } else {
      const newPartialScore = startScore - used;
      set({
        scores: { ...s.scores, [p.id]: newPartialScore },
        currentThrows: newThrows,
        turn: { ...s.turn, dartIndex: nextDart },
        history: [...s.history, prev].slice(-50),
        checkoutHint: routesNow.length ? formatRoute(routesNow[0]) : null,
      });
    }
  },

  continueForPlacements501() {
    const s = get();
    if (s.status !== "win_pending" || !s.winnerId) return;

    const finished = new Set(s.finishedIds);
    if (!finished.has(s.winnerId)) finished.add(s.winnerId);

    const podium = s.podium.includes(s.winnerId)
      ? s.podium
      : [...s.podium, s.winnerId];

    const aliveCount = s.players.filter((p) => !finished.has(p.id)).length;
    if (aliveCount <= 1) {
      const now = Date.now();
      set({
        status: "finished",
        winnerId: podium[0] || s.winnerId,
        podium,
        currentThrows: [],
        gameFinishedAt: now,
        checkoutHint: null,
      });
      return;
    }

    const nextIndex = nextAlivePlayerIndex(
      s.players,
      s.turn.playerIndex,
      finished,
    );
    const nextStart = get().scores[s.players[nextIndex].id];
    const mustDouble = !!s.mustDoubleOut;
    const routesNext =
      mustDouble && nextStart > 1 ? findCheckout(nextStart, 3) : [];

    set({
      finishedIds: Array.from(finished),
      podium,
      status: "in_progress",
      winnerId: null,
      currentThrows: [],
      turn: { playerIndex: nextIndex, dartIndex: 0 },
      turnStartScore: nextStart,
      checkoutHint: routesNext.length ? formatRoute(routesNext[0]) : null,
    });
  },
});
