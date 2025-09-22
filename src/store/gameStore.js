import { create } from "zustand";
import { persist } from "zustand/middleware";

const snapshot = (s) =>
  JSON.stringify({
    players: s.players,
    scores: s.scores,
    gameType: s.gameType,
    turn: s.turn,
    currentThrows: s.currentThrows,
    lastTurns: s.lastTurns,
    status: s.status,
    winnerId: s.winnerId,
    finishedAt: s.finishedAt,
    selectedPlayers: s.selectedPlayers,
    recentPlayers: s.recentPlayers,
  });

export const useGameStore = create(
  persist(
    (set, get) => ({
      players: [],
      scores: {},
      gameType: null,
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      status: "idle", // idle | in_progress | finished
      winnerId: null,
      finishedAt: null,

      recentPlayers: [],
      selectedPlayers: [],

      toggleSelectPlayer(name) {
        const sel = new Set(get().selectedPlayers);
        sel.has(name) ? sel.delete(name) : sel.add(name);
        set({ selectedPlayers: Array.from(sel) });
      },
      addNewPlayer(name) {
        if (!name) return;
        const rp = new Set(get().recentPlayers);
        rp.add(name);
        const sel = new Set(get().selectedPlayers);
        sel.add(name);
        set({
          recentPlayers: Array.from(rp).slice(-100),
          selectedPlayers: Array.from(sel),
        });
      },
      removeSelected(name) {
        set({
          selectedPlayers: get().selectedPlayers.filter((n) => n !== name),
        });
      },
      clearSelected() {
        set({ selectedPlayers: [] });
      },

      setPlayersFromSelected() {
        const names = get().selectedPlayers;
        const players = names
          .filter(Boolean)
          .map((name) => ({ id: crypto.randomUUID(), name }));
        set({ players });
      },

      addToRecent(names) {
        const setNames = new Set([
          ...(get().recentPlayers || []),
          ...names.filter(Boolean),
        ]);
        set({ recentPlayers: Array.from(setNames).slice(-100) });
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
        });
      },

      startGame(gameId) {
        if (gameId === "501") {
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
          });
        } else {
          set({
            gameType: gameId,
            status: "in_progress",
            turn: { playerIndex: 0, dartIndex: 0 },
            currentThrows: [],
            lastTurns: {},
            winnerId: null,
            finishedAt: null,
            history: [],
          });
        }
      },

      history: [],

      throwDart({ value, mult }) {
        const s = get();
        if (s.status !== "in_progress") return;
        const p = s.players[s.turn.playerIndex];
        if (!p) return;

        const prev = snapshot(s);
        const throwObj = { value: value ?? 0, mult: mult ?? 1 };
        const newThrows = [...s.currentThrows, throwObj];

        if (s.gameType === "501") {
          const delta = (throwObj.value ?? 0) * (throwObj.mult ?? 1);
          const newScore = Math.max(0, s.scores[p.id] - delta);
          const scores = { ...s.scores, [p.id]: newScore };

          if (newScore === 0) {
            const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
            set({
              scores,
              currentThrows: newThrows,
              lastTurns,
              status: "finished",
              winnerId: p.id,
              finishedAt: Date.now(),
              history: [...s.history, prev],
            });
            return;
          }

          const nextDart = s.turn.dartIndex + 1;
          if (nextDart >= 3) {
            const nextPlayer = (s.turn.playerIndex + 1) % s.players.length;
            const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
            set({
              scores,
              currentThrows: [],
              lastTurns,
              turn: { playerIndex: nextPlayer, dartIndex: 0 },
              history: [...s.history, prev],
            });
          } else {
            set({
              scores,
              currentThrows: newThrows,
              turn: { ...s.turn, dartIndex: nextDart },
              history: [...s.history, prev],
            });
          }
          return;
        }

        // default turn advance for other games (WIP)
        const nextDart = s.turn.dartIndex + 1;
        if (nextDart >= 3) {
          const nextPlayer = (s.turn.playerIndex + 1) % s.players.length;
          const lastTurns = { ...s.lastTurns, [p.id]: newThrows };
          set({
            currentThrows: [],
            lastTurns,
            turn: { playerIndex: nextPlayer, dartIndex: 0 },
            history: [...s.history, prev],
          });
        } else {
          set({
            currentThrows: newThrows,
            turn: { ...s.turn, dartIndex: nextDart },
            history: [...s.history, prev],
          });
        }
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
    }),
    { name: "dartgames-store" }
  )
);
