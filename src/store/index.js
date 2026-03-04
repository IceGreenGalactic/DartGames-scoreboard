import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { playersSlice } from "./slices/playersSlice";
import { sessionSlice } from "./slices/sessionSlice";
import { game501Slice } from "./slices/game501Slice";
import { gameKillerSlice } from "./slices/gameKillerSlice";
import { gameClockSlice } from "./slices/gameClockSlice";
import { gameCricketSlice } from "./slices/gameCricketSlice";
import { statsSlice } from "./slices/statsSlice";
import { themeSlice } from "./slices/themeSlice";

export const useGameStore = create(
  persist(
    (set, get, api) => ({
      ...playersSlice(set, get, api),
      ...sessionSlice(set, get, api),
      ...game501Slice(set, get, api),
      ...gameKillerSlice(set, get, api),
      ...gameClockSlice(set, get, api),
      ...statsSlice(set, get, api),
      ...themeSlice(set, get, api),
      ...gameCricketSlice(set, get),
    }),
    {
      name: "dartgames-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        players: s.players,

        scores: s.scores,
        gameType: s.gameType,
        turn: s.turn,
        currentThrows: s.currentThrows,
        lastTurns: s.lastTurns,
        status: s.status,
        winnerId: s.winnerId,
        finishedAt: s.finishedAt,

        cricketMarks: s.cricketMarks,

        finishedIds: s.finishedIds,
        podium: s.podium,
        finishTimes: s.finishTimes,

        history: s.history,
        gameStartedAt: s.gameStartedAt,
        gameFinishedAt: s.gameFinishedAt,
        checkoutHint: s.checkoutHint,
        lastBustAt: s.lastBustAt,
        mustDoubleOut: s.mustDoubleOut,
        recentPlayers: s.recentPlayers,
        selectedPlayers: s.selectedPlayers,
        sessions: s.sessions,
        stats: s.stats,
        theme: s.theme,
        clock: s.clock,
      }),
      version: 4,
    },
  ),
);
