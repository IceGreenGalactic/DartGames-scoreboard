import { recomputeStats } from "../lib/stats";

export const statsSlice = (set, get) => ({
  sessions: [],
  stats: recomputeStats([]),

  addSession(session) {
    const sessions = get().sessions.slice();
    sessions.push(session);
    const stats = recomputeStats(sessions);
    set({ sessions, stats });
  },

  updateSession(sessionId, updater) {
    const sessions = get().sessions.map((x) =>
      x.id === sessionId ? updater(x) : x
    );
    const stats = recomputeStats(sessions);
    set({ sessions, stats });
  },

  deleteSession(sessionId) {
    const sessions = get().sessions.filter((x) => x.id !== sessionId);
    const stats = recomputeStats(sessions);
    set({ sessions, stats });
  },
});
