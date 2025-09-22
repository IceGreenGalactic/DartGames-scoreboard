export const playersSlice = (set, get) => ({
  recentPlayers: [],
  selectedPlayers: [],
  players: [],

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
    set({ selectedPlayers: get().selectedPlayers.filter((n) => n !== name) });
  },

  clearSelected() {
    set({ selectedPlayers: [] });
  },

  addToRecent(names) {
    const setNames = new Set([
      ...(get().recentPlayers || []),
      ...names.filter(Boolean),
    ]);
    set({ recentPlayers: Array.from(setNames).slice(-100) });
  },

  setPlayersFromSelected() {
    const names = get().selectedPlayers;
    const players = names
      .filter(Boolean)
      .map((name) => ({ id: crypto.randomUUID(), name }));
    set({ players });
  },

  addPlayerMidGame(name) {
    if (!name) return;
    const s = get();
    const newP = { id: crypto.randomUUID(), name };
    const players = [...s.players];
    players.splice(s.turn.playerIndex + 1, 0, newP);
    const scores = { ...s.scores, [newP.id]: s.gameType === "501" ? 501 : 0 };
    set({ players, scores });

    const rp = new Set(s.recentPlayers);
    rp.add(name);
    set({ recentPlayers: Array.from(rp).slice(-100) });
  },
});
