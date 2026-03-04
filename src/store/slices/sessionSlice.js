import { shufflePlayers } from "../lib/turnOrder";
import { initRuntime, exportRuntime } from "../lib/runtime";

export const sessionSlice = (set, get) => ({
  scores: {},
  gameType: null,
  turn: { playerIndex: 0, dartIndex: 0 },
  currentThrows: [],
  lastTurns: {},
  status: "idle",
  winnerId: null,
  finishedAt: null,
  history: [],
  turnStartScore: 0,
  finishedIds: [],
  podium: [],
  lastBustAt: 0,
  gameStartedAt: 0,
  gameFinishedAt: 0,
  finishTimes: {},
  checkoutHint: null,
  hasLoggedSession: false,
  mustDoubleOut: null,
  runtime: null,

  snapshot() {
    const s = get();
    return JSON.stringify({
      players: s.players,
      scores: s.scores,
      gameType: s.gameType,
      turn: s.turn,
      currentThrows: s.currentThrows,
      lastTurns: s.lastTurns,
      status: s.status,
      winnerId: s.winnerId,
      finishedAt: s.finishedAt,
      turnStartScore: s.turnStartScore,
      finishedIds: s.finishedIds,
      podium: s.podium,
      gameStartedAt: s.gameStartedAt,
      gameFinishedAt: s.gameFinishedAt,
      finishTimes: s.finishTimes,
      checkoutHint: s.checkoutHint,
      hasLoggedSession: s.hasLoggedSession,
      targetsClock: s.targetsClock,
      mustDoubleOut: s.mustDoubleOut,
      cricketMarks: s.cricketMarks,
    });
  },

  resetGame(preservePlayers = false) {
    const s = get();
    set({
      scores: {},
      gameType: null,
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      status: "idle",
      winnerId: null,
      finishedAt: null,
      history: [],
      turnStartScore: 0,
      finishedIds: [],
      podium: [],
      lastBustAt: 0,
      gameStartedAt: 0,
      gameFinishedAt: 0,
      finishTimes: {},
      checkoutHint: null,
      hasLoggedSession: false,
      players: preservePlayers ? s.players : [],
      mustDoubleOut: null,
      runtime: null,
      x01Start: null,
    });
  },

  startGame(gameId, names, numbers, options) {
    const s = get();

    if (gameId === "501") {
      set({ players: shufflePlayers(s.players || []) });
      get().startGame501();
      initRuntime(get, set, "501");
      set({ hasLoggedSession: false });
      return;
    }

    if (gameId === "301") {
      set({ players: shufflePlayers(s.players || []) });
      get().startGame301();
      initRuntime(get, set, "301");
      set({ hasLoggedSession: false });
      return;
    }

    if (gameId === "killer") {
      get().startGameKiller(names, numbers, options);
      initRuntime(get, set, "killer");
      set({ hasLoggedSession: false });
      return;
    }

    if (gameId === "clock") {
      set({ players: shufflePlayers(s.players || []) });
      get().startGameClock();
      initRuntime(get, set, "clock");
      set({ hasLoggedSession: false });
      return;
    }

    if (gameId === "cricket") {
      set({ players: shufflePlayers(s.players || []) });
      get().startGameCricket();
      initRuntime(get, set, "cricket");
      set({ hasLoggedSession: false });
      return;
    }

    set({
      gameType: gameId,
      status: "in_progress",
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      winnerId: null,
      finishedAt: null,
      history: [],
      turnStartScore: 0,
      finishedIds: [],
      podium: [],
      gameStartedAt: Date.now(),
      gameFinishedAt: 0,
      finishTimes: {},
      checkoutHint: null,
      hasLoggedSession: false,
    });
    initRuntime(get, set, gameId);
  },

  throwDart(payload) {
    const type = get().gameType;
    if (type === "501" || type === "301") return get().throwDart501(payload);
    if (type === "killer") return get().throwDartKiller(payload);
    if (type === "clock") return get().throwDartClock(payload);
    if (type === "cricket") return get().throwDartCricket(payload);

    const s = get();
    if (s.status !== "in_progress") return;
    const prev = get().snapshot();
    const pIndex = s.turn.playerIndex;
    const p = s.players[pIndex];
    if (!p) return;
    const newThrows = [
      ...s.currentThrows,
      { value: payload.value ?? 0, mult: payload.mult ?? 1 },
    ];
    const nextDart = s.turn.dartIndex + 1;
    if (nextDart >= 3) {
      const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
      set({
        currentThrows: [],
        lastTurns,
        turn: { playerIndex: (pIndex + 1) % s.players.length, dartIndex: 0 },
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

  continueForPlacements() {
    const type = get().gameType;
    const s = get();
    if (!s.hasLoggedSession && s.winnerId) get().finalizeWinner(s.winnerId);
    if (type === "501" || type === "301")
      return get().continueForPlacements501();
    if (type === "clock") return get().continueForPlacementsClock();
    if (type === "cricket") return get().continueForPlacementsCricket();
  },

  undo() {
    const s = get();
    const prev = s.history.at(-1);
    if (!prev) return;
    const state = JSON.parse(prev);
    set({ ...state, history: s.history.slice(0, -1) });
  },

  finalizeWinner(winnerId) {
    const s = get();
    const now = Date.now();
    const podium = Array.isArray(s.podium) ? s.podium.slice() : [];
    if (winnerId && !podium.includes(winnerId)) podium.push(winnerId);
    const ft = { ...(s.finishTimes || {}) };
    if (winnerId && !ft[winnerId]) ft[winnerId] = now;
    set({
      status: "win_pending",
      winnerId: winnerId || s.winnerId || null,
      finishedAt: now,
      podium,
      finishTimes: ft,
    });
    const g = get();
    if (podium.length === 1 && !g.hasLoggedSession && g.addSession) {
      const w = g.players.find((p) => p.id === (winnerId || g.winnerId));
      const base = {
        id: crypto.randomUUID(),
        game: g.gameType,
        date: new Date().toISOString(),
        players: g.players.map((x) => x.name),
        winner: w ? w.name : null,
        x01Start: g.x01Start || null,
      };
      const rt = exportRuntime(get);
      g.addSession({ ...base, ...rt });
      set({ hasLoggedSession: true });
    }
  },

  finishGameNow() {
    const s = get();
    if (!s.hasLoggedSession) {
      const firstWinnerId = s.podium[0] || s.winnerId || null;
      if (firstWinnerId) get().finalizeWinner(firstWinnerId);
    }
    const now = Date.now();
    const s2 = get();
    set({
      status: "finished",
      winnerId: s2.winnerId || s2.podium[0] || null,
      podium: Array.isArray(s2.podium)
        ? s2.podium.slice()
        : s2.winnerId
          ? [s2.winnerId]
          : [],
      gameFinishedAt: now,
      currentThrows: [],
      finishTimes: { ...(s2.finishTimes || {}) },
    });
  },

  toggleDoubleOut() {
    const s = get();
    set({ mustDoubleOut: !s.mustDoubleOut, checkoutHint: null });
  },
});
