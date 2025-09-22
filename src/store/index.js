import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { playersSlice } from "./slices/playersSlice";
import { sessionSlice } from "./slices/sessionSlice";
import { game501Slice } from "./slices/game501Slice";

export const useGameStore = create(
  persist(
    (set, get, api) => ({
      ...playersSlice(set, get, api),
      ...sessionSlice(set, get, api),
      ...game501Slice(set, get, api),
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
        recentPlayers: s.recentPlayers,
        selectedPlayers: s.selectedPlayers,
      }),
      version: 2,
    }
  )
);
