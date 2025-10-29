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
      fewestDartsWinPerPlayer: {},
    },
    301: {
      plays: 0,
      winsPerPlayer: {},
      playsPerPlayer: {},
      bestTurnPerPlayer: {},
      fewestDartsWinPerPlayer: {},
    },
    killer: {
      plays: 0,
      winsPerPlayer: {},
      playsPerPlayer: {},
      mostKillsPerPlayer: {},
      totalKillsPerPlayer: {},
    },
    clock: {
      plays: 0,
      winsPerPlayer: {},
      playsPerPlayer: {},
      fastestPerPlayer: {},
    },
  },
  totalPlays: 0,
});

function pickNumber(...candidates) {
  for (const c of candidates) {
    if (typeof c === "number" && !Number.isNaN(c)) return c;
  }
  return null;
}
function pickString(...candidates) {
  for (const c of candidates) {
    if (typeof c === "string" && c.length) return c;
  }
  return null;
}

export function recomputeStats(sessions) {
  const stats = emptyStats();
  stats.totalPlays = sessions.length;

  for (const s of sessions) {
    if (s.game === "501" || s.game === "301" || s.game === "x01") {
      const key = String(s.x01Start || s.game);
      const g = stats.byGame[key];
      if (!g) continue;

      g.plays += 1;
      for (const p of s.players || []) inc(g.playsPerPlayer, p);
      if (s.winner) inc(g.winsPerPlayer, s.winner);

      if (Array.isArray(s.turns) && s.turns.length) {
        for (const t of s.turns) {
          const sc = pickNumber(
            t?.score,
            t?.turnScore,
            t?.sum,
            t?.points,
            t?.total
          );
          const pl = pickString(t?.player, t?.playerName, t?.name);
          if (pl && sc != null) maxInto(g.bestTurnPerPlayer, pl, sc);
        }
      }

      if (s.bestTurnPerPlayer && typeof s.bestTurnPerPlayer === "object") {
        for (const [name, val] of Object.entries(s.bestTurnPerPlayer)) {
          if (typeof val === "number") maxInto(g.bestTurnPerPlayer, name, val);
        }
      }

      if (s.dartsUsedToFinish && s.winner)
        minInto(g.fewestDartsWinPerPlayer, s.winner, s.dartsUsedToFinish);
    } else if (s.game === "killer") {
      const g = stats.byGame.killer;
      g.plays += 1;
      for (const p of s.players || []) inc(g.playsPerPlayer, p);
      if (s.winner) inc(g.winsPerPlayer, s.winner);
      if (s.kills) {
        for (const [p, k] of Object.entries(s.kills)) {
          maxInto(g.mostKillsPerPlayer, p, k);
          inc(g.totalKillsPerPlayer, p, typeof k === "number" ? k : 0);
        }
      }
    } else if (s.game === "clock" || s.game === "around-the-clock") {
      const g = stats.byGame.clock;
      g.plays += 1;
      for (const p of s.players || []) inc(g.playsPerPlayer, p);
      if (s.winner) inc(g.winsPerPlayer, s.winner);
       if (s.dartsPerPlayer && s.winner) {
    const d = s.dartsPerPlayer[s.winner];
    if (typeof d === "number") minInto(g.fastestPerPlayer, s.winner, d);
  }
}
  }

  return stats;
}
