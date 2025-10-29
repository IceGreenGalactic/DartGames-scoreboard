import { rtOnThrow, rtOnTurnEnd } from "../lib/runtime";
import {
  LIVES_MIN,
  LIVES_MAX,
  isAlive,
  nextAliveIndex,
  ensureCurrentAlive,
  turnScoreOf,
  makeKillerPlayers,
  buildKillerSnapshot,
  initKillerExtras,
  updateFlags,
  applyOwnHit,
  applyVictimHit,
} from "../lib/killerCore";

export const gameKillerSlice = (set, get) => ({
  startGameKiller(names, numbers, options = {}) {
    const { doubleIn = false, selfKill = true } = options;
    const players = makeKillerPlayers(names, numbers, doubleIn);
    set({
      players,
      scores: Object.fromEntries(players.map((p) => [p.id, 0])),
      gameType: "killer",
      status: "in_progress",
      turn: { playerIndex: 0, dartIndex: 0 },
      currentThrows: [],
      lastTurns: {},
      winnerId: null,
      finishedAt: null,
      history: [],
      finishedIds: [],
      podium: [],
      rules: { doubleIn, selfKill },
      gameStartedAt: Date.now(),
      gameFinishedAt: 0,
      ...initKillerExtras(),
    });
  },

  throwDartKiller({ value, mult }) {
    const s = get();
    if (s.status !== "in_progress") return;

    let { playerIndex, dartIndex } = s.turn;
    let { p, idx } = ensureCurrentAlive(s.players, playerIndex);
    playerIndex = idx;
    if (!p) return;

    const rules = s.rules || {};
    const amt = mult || 1;

    const snapshot = buildKillerSnapshot(s);

    let players = s.players.slice();
    let kills = { ...(s.kills || {}) };
    let finishTimes = { ...(s.finishTimes || {}) };
    let killerAt = { ...(s.killerAt || {}) };
    let eliminationLog = Array.isArray(s.eliminationLog)
      ? s.eliminationLog.slice()
      : [];
    let lastDamagedBy = { ...(s.lastDamagedBy || {}) };
    let killerTurnFlags = updateFlags(
      s.killerTurnFlags,
      p.id,
      dartIndex,
      p.lives,
      false
    );
    let currentThrows = [...(s.currentThrows || []), { value, mult }];

    rtOnThrow(get, set, {
      playerId: p.id,
      t: { value, mult },
      preScore: null,
      postScore: null,
      bust: false,
    });

    const hitOwn = value === p.target && value !== 0;

    if (hitOwn) {
      killerTurnFlags = updateFlags(
        killerTurnFlags,
        p.id,
        dartIndex,
        p.lives,
        true
      );
      players = applyOwnHit(players, p.id, amt, rules);
    } else if (p.lives >= LIVES_MAX && value) {
      const res = applyVictimHit(
        players,
        p,
        value,
        amt,
        finishTimes,
        lastDamagedBy,
        kills
      );
      players = res.players;
      kills = res.kills;
      finishTimes = res.finishTimes;
      lastDamagedBy = res.lastDamagedBy;
      if (res.elimination) eliminationLog.push(res.elimination);
    }

    players = players.map((pl) => ({ ...pl, isKiller: pl.lives >= LIVES_MAX }));

    const updatedP = players.find((pl) => pl.id === p.id);
    if (
      updatedP &&
      p.lives < LIVES_MAX &&
      updatedP.lives >= LIVES_MAX &&
      !killerAt[p.id]
    ) {
      killerAt[p.id] = Date.now();
    }

    const aliveNow = players.filter((pl) => isAlive(pl.lives));
    if (aliveNow.length === 1) {
      const winner = aliveNow[0];
      set({
        players,
        kills,
        finishTimes,
        killerAt,
        eliminationLog,
        lastDamagedBy,
        currentThrows,
        lastTurns: { ...s.lastTurns, [p.id]: currentThrows },
        status: "win_pending",
        winnerId: winner.id,
        finishedAt: Date.now(),
        podium: [winner.id],
        history: [...(s.history || []), snapshot],
        killerTurnFlags,
        turn: { playerIndex, dartIndex: Math.min(2, dartIndex + 1) },
      });
      get().finalizeWinner(winner.id);
      rtOnTurnEnd(get, set, {
        playerId: p.id,
        turnScore: turnScoreOf(currentThrows),
      });
      return;
    }

    const nextDart = dartIndex + 1;

    if (nextDart >= 3) {
      const flags = killerTurnFlags[p.id] || {
        startedAtMinusOne: false,
        hitOwn: false,
      };
      if (flags.startedAtMinusOne && !flags.hitOwn) {
        players = players.map((pl) =>
          pl.id === p.id ? { ...pl, lives: LIVES_MIN, isKiller: false } : pl
        );
        if (!finishTimes[p.id]) finishTimes[p.id] = Date.now();
        eliminationLog.push({
          by: lastDamagedBy[p.id] || null,
          victim: p.id,
          at: Date.now(),
        });

        const aliveNowAfter = players.filter((pl) => isAlive(pl.lives));
        if (aliveNowAfter.length === 1) {
          const winner = aliveNowAfter[0];
          rtOnTurnEnd(get, set, {
            playerId: p.id,
            turnScore: turnScoreOf(currentThrows),
          });
          set({
            players,
            kills,
            finishTimes,
            killerAt,
            eliminationLog,
            lastDamagedBy,
            currentThrows: [],
            lastTurns: { ...s.lastTurns, [p.id]: currentThrows },
            status: "win_pending",
            winnerId: winner.id,
            finishedAt: Date.now(),
            podium: [winner.id],
            history: [...(s.history || []), snapshot],
            killerTurnFlags,
            turn: { playerIndex, dartIndex: 0 },
          });
          get().finalizeWinner(winner.id);
          return;
        }
      }

      const nextIdx = nextAliveIndex(players, playerIndex);
      const nextPlayer = players[nextIdx];

      set({
        players,
        kills,
        finishTimes,
        killerAt,
        eliminationLog,
        lastDamagedBy,
        currentThrows: [],
        lastTurns: { ...s.lastTurns, [p.id]: currentThrows },
        turn: { playerIndex: nextIdx, dartIndex: 0 },
        history: [...(s.history || []), snapshot],
        killerTurnFlags: {
          ...killerTurnFlags,
          [p.id]: { startedAtMinusOne: false, hitOwn: false },
          ...(nextPlayer
            ? {
                [nextPlayer.id]: {
                  startedAtMinusOne: nextPlayer.lives === -1,
                  hitOwn: false,
                },
              }
            : {}),
        },
      });
    } else {
      set({
        players,
        kills,
        finishTimes,
        killerAt,
        eliminationLog,
        lastDamagedBy,
        currentThrows,
        turn: { ...s.turn, dartIndex: nextDart },
        history: [...(s.history || []), snapshot],
        killerTurnFlags,
      });
    }
  },

  undoKiller() {
    const s = get();
    const prev = s.history?.[s.history.length - 1];
    if (!prev) return;
    set({
      players: prev.players,
      kills: prev.kills,
      turn: prev.turn,
      currentThrows: prev.currentThrows,
      lastTurns: prev.lastTurns,
      status: prev.status,
      winnerId: prev.winnerId,
      finishedAt: prev.finishedAt,
      podium: prev.podium,
      killerTurnFlags: prev.killerTurnFlags,
      finishTimes: prev.finishTimes,
      killerAt: prev.killerAt,
      eliminationLog: prev.eliminationLog,
      lastDamagedBy: prev.lastDamagedBy,
      history: s.history.slice(0, -1),
    });
  },
});
