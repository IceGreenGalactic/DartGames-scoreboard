const inc = (map, key, by = 1) => {
  map[key] = (map[key] || 0) + by;
};
const maxInto = (map, key, val) => {
  map[key] = Math.max(map[key] || 0, val);
};
const minInto = (map, key, val) => {
  if (map[key] == null) map[key] = val;
  else map[key] = Math.min(map[key], val);
};

const emptyStats = () => ({
  byGame: {
    501: {
      plays: 0,
      winsPerPlayer: {},
      playsPerPlayer: {},
      bestTurnPerPlayer: {},
      bestCheckoutPerPlayer: {},
      fewestDartsWinPerPlayer: {},
    },
    killer: {
      plays: 0,
      winsPerPlayer: {},
      playsPerPlayer: {},
      mostKillsPerPlayer: {},
    },
    "around-the-clock": {
      plays: 0,
      winsPerPlayer: {},
      playsPerPlayer: {},
      fastestPerPlayer: {},
    },
  },
  totalPlays: 0,
});

export function recomputeStats(sessions) {
  const stats = emptyStats();
  stats.totalPlays = sessions.length;
  for (const s of sessions) {
    if (s.game === "501") {
      const g = stats.byGame["501"];
      g.plays += 1;
      for (const p of s.players || []) inc(g.playsPerPlayer, p);
      if (s.winner) inc(g.winsPerPlayer, s.winner);
      if (s.turns && s.turns.length) {
        for (const t of s.turns) {
          if (t && typeof t.score === "number" && t.player) {
            maxInto(g.bestTurnPerPlayer, t.player, t.score);
          }
        }
      }
      if (s.highestCheckout && s.winner)
        maxInto(g.bestCheckoutPerPlayer, s.winner, s.highestCheckout);
      if (s.dartsUsedToFinish && s.winner)
        minInto(g.fewestDartsWinPerPlayer, s.winner, s.dartsUsedToFinish);
    } else if (s.game === "killer") {
      const g = stats.byGame["killer"];
      g.plays += 1;
      for (const p of s.players || []) inc(g.playsPerPlayer, p);
      if (s.winner) inc(g.winsPerPlayer, s.winner);
      if (s.kills) {
        for (const [p, k] of Object.entries(s.kills))
          maxInto(g.mostKillsPerPlayer, p, k);
      }
    } else if (s.game === "around-the-clock") {
      const g = stats.byGame["around-the-clock"];
      g.plays += 1;
      for (const p of s.players || []) inc(g.playsPerPlayer, p);
      if (s.winner) inc(g.winsPerPlayer, s.winner);
      if (s.dartsPerPlayer) {
        for (const [p, darts] of Object.entries(s.dartsPerPlayer))
          minInto(g.fastestPerPlayer, p, darts);
      }
    }
  }
  return stats;
}
