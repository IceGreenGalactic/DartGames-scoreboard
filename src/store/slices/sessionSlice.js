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
    });
  },

  resetGame() {
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
    });
  },

  startGame(gameId) {
    const s = get();
    if (!s.players.length) return;

    if (gameId === "501") {
      get().startGame501();
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
    });
  },

  throwDart(payload) {
    const type = get().gameType;
    if (type === "501") return get().throwDart501(payload);

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
    if (type === "501") return get().continueForPlacements501();
  },

  undo() {
    const s = get();
    const prev = s.history.at(-1);
    if (!prev) return;
    const state = JSON.parse(prev);
    set({
      ...state,
      history: s.history.slice(0, -1),
    });
  },
});
