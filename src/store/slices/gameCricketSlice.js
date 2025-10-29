import { rtOnThrow, rtOnTurnEnd } from "../lib/runtime";
import { CRICKET_ORDER, marksFromHit, allClosed } from "../lib/cricketCore";

export const gameCricketSlice = (set, get) => ({
  startGameCricket() {
    const players = get().players;
    if (!players?.length) return;

    const scores = {};
    const marks = {};
    players.forEach((p) => {
      scores[p.id] = 0;
      marks[p.id] = { 20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, BULL: 0 };
    });

    set({
      scores,
      cricketMarks: marks,
      gameType: "cricket",
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
      gameFinishedAt: 0,
      finishTimes: {},
      hasLoggedSession: false,
    });
  },

  throwDartCricket({ value, mult }) {
    const s = get();
    if (s.status !== "in_progress" && s.status !== "win_pending") return;

    const prev = get().snapshot();
    const { playerIndex, dartIndex } = s.turn;
    const players = s.players.slice();
    const p = players[playerIndex];
    if (!p) return;

    const finished = new Set(s.finishedIds || []);
    if (finished.has(p.id)) {
      const n = players.length;
      let nextIndex = playerIndex;
      for (let i = 1; i <= n; i++) {
        const idx = (playerIndex + i) % n;
        const pid = players[idx]?.id;
        if (pid && !finished.has(pid)) {
          nextIndex = idx;
          break;
        }
      }
      set({ turn: { playerIndex: nextIndex, dartIndex: 0 } });
      return;
    }

    const scores = { ...(s.scores || {}) };
    const marks = JSON.parse(JSON.stringify(s.cricketMarks || {}));
    const lastTurns = { ...(s.lastTurns || {}) };
    const finishTimes = { ...(s.finishTimes || {}) };

    const t = { value: value ?? 0, mult: mult ?? 1 };
    const key =
      t.value === 25
        ? "BULL"
        : CRICKET_ORDER.find((k) => k !== "BULL" && Number(k) === t.value) ||
          null;

    if (key) {
      const before = marks[p.id][key] || 0;
      const add = marksFromHit(key, t.value, t.mult);
      if (add > 0) {
        marks[p.id][key] = Math.min(3, before + add);
      }
    }

    rtOnThrow(get, set, {
      playerId: p.id,
      t,
      preScore: scores[p.id] || 0,
      postScore: scores[p.id] || 0,
      bust: false,
    });

    const ct = (s.currentThrows || []).slice();
    ct.push({ value: t.value, mult: t.mult });

    if (allClosed(marks[p.id])) {
      const now = Date.now();
      lastTurns[p.id] = ct.slice();

      set({
        cricketMarks: marks,
        scores,
        currentThrows: ct,
        lastTurns,
        finishedAt: now,
        finishTimes: { ...finishTimes, [p.id]: now },
        history: [...(s.history || []), prev].slice(-50),
        checkoutHint: null,
      });

      const g = get();
      if (g.finalizeWinner) g.finalizeWinner(p.id);
      return;
    }

    const nextDart = dartIndex + 1;
    if (nextDart >= 3) {
      lastTurns[p.id] = ct.slice();

      const turnScore = ct.reduce((acc, x) => {
        if (x.value === 0) return acc;
        if (x.value === 25) return acc + (x.mult === 2 ? 50 : 25);
        return acc + (x.value || 0) * (x.mult || 1);
      }, 0);
      rtOnTurnEnd(get, set, { playerId: p.id, turnScore });

      const n = players.length;
      let nextIndex = playerIndex;
      for (let i = 1; i <= n; i++) {
        const idx = (playerIndex + i) % n;
        const pid = players[idx]?.id;
        if (pid && !finished.has(pid)) {
          nextIndex = idx;
          break;
        }
      }

      set({
        cricketMarks: marks,
        scores,
        lastTurns,
        currentThrows: [],
        turn: { playerIndex: nextIndex, dartIndex: 0 },
        history: [...(s.history || []), prev].slice(-50),
      });
    } else {
      set({
        cricketMarks: marks,
        scores,
        currentThrows: ct,
        turn: { ...s.turn, dartIndex: nextDart },
        history: [...(s.history || []), prev].slice(-50),
      });
    }
  },

  continueForPlacementsCricket() {
    const s = get();
    if (s.status !== "win_pending" || !s.winnerId) return;

    const finished = new Set(s.finishedIds || []);
    finished.add(s.winnerId);

    const podium = Array.isArray(s.podium) ? s.podium.slice() : [];
    if (!podium.includes(s.winnerId)) podium.push(s.winnerId);

    const alive = s.players.filter((p) => !finished.has(p.id));
    if (alive.length <= 1) {
      const now = Date.now();
      set({
        status: "finished",
        winnerId: podium[0] || s.winnerId,
        podium,
        currentThrows: [],
        gameFinishedAt: now,
        finishedIds: Array.from(finished),
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
