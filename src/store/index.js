import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    { name: "dartgames-store" }
  )
);
