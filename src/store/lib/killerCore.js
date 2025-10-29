import { shufflePlayers } from "./turnOrder";

export const LIVES_MIN = -2;
export const LIVES_MAX = 3;

export function isAlive(l) {
  return l > LIVES_MIN;
}
export function bounceUp(current, delta) {
  return Math.min(LIVES_MAX, current + (delta || 1));
}
export function clampDown(current, delta) {
  return Math.max(LIVES_MIN, current - (delta || 1));
}

export function nextAliveIndex(players, from) {
  const n = players.length;
  for (let i = 1; i <= n; i++) {
    const idx = (from + i) % n;
    if (players[idx] && isAlive(players[idx].lives)) return idx;
  }
  return from;
}
export function ensureCurrentAlive(players, idx) {
  const p = players[idx];
  if (!p || !isAlive(p.lives)) {
    const nextIdx = nextAliveIndex(players, idx - 1);
    return { p: players[nextIdx], idx: nextIdx };
  }
  return { p, idx };
}

export function turnScoreOf(arr) {
  return (arr || []).reduce((s, x) => {
    if (x.value === 0) return s;
    if (x.value === 25) return s + (x.mult === 2 ? 50 : 25);
    return s + (x.value || 0) * (x.mult || 1);
  }, 0);
}

export function makeKillerPlayers(names, numbers, doubleIn) {
  const pairs = (names || []).map((name, i) => ({
    name,
    number: numbers?.[i],
  }));
  const shuffled = shufflePlayers(pairs);
  return shuffled.map((x) => ({
    id: crypto.randomUUID(),
    name: x.name,
    target: x.number,
    lives: 0,
    hasEntered: !doubleIn,
    isKiller: false,
    kills: 0,
  }));
}

export function buildKillerSnapshot(s) {
  return {
    players: s.players,
    kills: s.kills,
    turn: s.turn,
    currentThrows: s.currentThrows,
    lastTurns: s.lastTurns,
    status: s.status,
    winnerId: s.winnerId,
    finishedAt: s.finishedAt,
    podium: s.podium,
    killerTurnFlags: s.killerTurnFlags,
    finishTimes: s.finishTimes,
    killerAt: s.killerAt,
    eliminationLog: s.eliminationLog,
    lastDamagedBy: s.lastDamagedBy,
  };
}

export function initKillerExtras() {
  return {
    kills: {},
    killerTurnFlags: {},
    finishTimes: {},
    killerAt: {},
    eliminationLog: [],
    lastDamagedBy: {},
  };
}

export function updateFlags(flags, pid, dartIndex, pLives, hitOwn) {
  const out = { ...(flags || {}) };
  if (dartIndex === 0)
    out[pid] = { startedAtMinusOne: pLives === -1, hitOwn: false };
  if (hitOwn) {
    out[pid] = {
      ...(out[pid] || { startedAtMinusOne: pLives === -1, hitOwn: false }),
      hitOwn: true,
    };
  }
  return out;
}

export function applyOwnHit(players, pid, amt, rules) {
  return players.map((pl) => {
    if (pl.id !== pid) return pl;
    if (!pl.hasEntered) {
      if ((rules.doubleIn && amt === 2) || !rules.doubleIn) {
        return { ...pl, hasEntered: true, lives: bounceUp(pl.lives, amt) };
      }
      return pl;
    }
    if (pl.lives >= LIVES_MAX && rules.selfKill) {
      return { ...pl, lives: clampDown(pl.lives, amt) };
    }
    return { ...pl, lives: bounceUp(pl.lives, amt) };
  });
}

export function applyVictimHit(
  players,
  attacker,
  value,
  amt,
  finishTimes,
  lastDamagedBy,
  kills
) {
  const victim = players.find(
    (pl) => pl.target === value && pl.id !== attacker.id && isAlive(pl.lives)
  );
  if (!victim)
    return {
      players,
      kills,
      finishTimes,
      lastDamagedBy,
      elimination: null,
    };

  let victimDied = false;
  const after = players.map((pl) => {
    if (pl.id !== victim.id) return pl;
    const newLives = clampDown(pl.lives, amt);
    lastDamagedBy[pl.id] = attacker.id;
    if (isAlive(pl.lives) && !isAlive(newLives) && !finishTimes[pl.id]) {
      finishTimes[pl.id] = Date.now();
      victimDied = true;
    }
    return { ...pl, lives: newLives };
  });

  const killsOut = {
    ...kills,
    [attacker.name]: (kills[attacker.name] || 0) + amt,
  };
  const after2 = after.map((pl) =>
    pl.id === attacker.id ? { ...pl, kills: (pl.kills || 0) + amt } : pl
  );

  return {
    players: after2,
    kills: killsOut,
    finishTimes,
    lastDamagedBy,
    elimination: victimDied
      ? { by: attacker.id, victim: victim.id, at: Date.now() }
      : null,
  };
}
