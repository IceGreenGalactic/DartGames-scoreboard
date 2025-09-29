export const gameKillerSlice = (set, get) => ({
  startGameKiller(names, numbers, options = {}) {
    const { doubleIn = false, selfKill = true } = options;

    const players = names.map((name, i) => ({
      id: crypto.randomUUID(),
      name,
      target: numbers[i],
      lives: 0,
      hasEntered: !doubleIn,
      isKiller: false,
      kills: 0,
    }));

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
      kills: {},
      rules: { doubleIn, selfKill },
      killerTurnFlags: {},
    });
  },

  throwDartKiller({ value, mult }) {
    const s = get();
    if (s.status !== "in_progress") return;

    let { playerIndex, dartIndex } = s.turn;

    function nextAliveIndex(from) {
      const n = s.players.length;
      for (let i = 1; i <= n; i++) {
        const idx = (from + i) % n;
        if (s.players[idx]?.lives > -2) return idx;
      }
      return from;
    }
    function ensureCurrentAlive(idx) {
      let p = s.players[idx];
      if (!p || p.lives <= -2) {
        const nextIdx = nextAliveIndex(idx - 1);
        return { p: s.players[nextIdx], idx: nextIdx };
      }
      return { p, idx };
    }

    let { p, idx } = ensureCurrentAlive(playerIndex);
    playerIndex = idx;
    if (!p) return;

    const rules = s.rules || {};
    const livesMin = -2;
    const livesMax = 3;

    function bounceUp(current, deltaUp) {
      return Math.min(livesMax, current + deltaUp);
    }
    function clampDown(current, deltaDown) {
      let v = current - deltaDown;
      if (v < livesMin) v = livesMin;
      return v;
    }

    const snapshot = {
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
    };

    let players = [...s.players];
    let kills = { ...(s.kills || {}) };
    let currentThrows = [...s.currentThrows, { value, mult }];

    let killerTurnFlags = { ...(s.killerTurnFlags || {}) };
    if (dartIndex === 0) {
      killerTurnFlags[p.id] = {
        startedAtMinusOne: p.lives === -1,
        hitOwn: false,
      };
    }

    const hitOwn = value === p.target && value !== 0;
    const amt = mult || 1;

    if (hitOwn) {
      killerTurnFlags[p.id] = {
        ...(killerTurnFlags[p.id] || {
          startedAtMinusOne: p.lives === -1,
          hitOwn: false,
        }),
        hitOwn: true,
      };

      if (!p.hasEntered) {
        if ((rules.doubleIn && mult === 2) || !rules.doubleIn) {
          players = players.map((pl) =>
            pl.id === p.id
              ? { ...pl, hasEntered: true, lives: bounceUp(pl.lives, amt) }
              : pl
          );
        }
      } else {
        if (p.lives >= 3 && rules.selfKill) {
          players = players.map((pl) =>
            pl.id === p.id ? { ...pl, lives: clampDown(pl.lives, amt) } : pl
          );
        } else {
          players = players.map((pl) =>
            pl.id === p.id ? { ...pl, lives: bounceUp(pl.lives, amt) } : pl
          );
        }
      }
    } else if (p.lives >= 3 && value) {
      const victim = players.find(
        (pl) => pl.target === value && pl.id !== p.id && pl.lives > -2
      );
      if (victim) {
        players = players.map((pl) =>
          pl.id === victim.id ? { ...pl, lives: clampDown(pl.lives, amt) } : pl
        );
        kills[p.name] = (kills[p.name] || 0) + amt;
      }
    }

    players = players.map((pl) => ({ ...pl, isKiller: pl.lives >= 3 }));

    const aliveNow = players.filter((pl) => pl.lives > -2);
    if (aliveNow.length === 1) {
      const winner = aliveNow[0];
      set({
        players,
        kills,
        currentThrows,
        lastTurns: { ...s.lastTurns, [p.id]: currentThrows },
        status: "win_pending",
        winnerId: winner.id,
        finishedAt: Date.now(),
        podium: [winner.id],
        history: [...s.history, snapshot],
        killerTurnFlags,
        turn: { playerIndex, dartIndex: Math.min(2, dartIndex + 1) },
      });
      get().finalizeWinner(winner.id);
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
          pl.id === p.id ? { ...pl, lives: -2, isKiller: false } : pl
        );

        const aliveNowAfter = players.filter((pl) => pl.lives > -2);
        if (aliveNowAfter.length === 1) {
          const winner = aliveNowAfter[0];
          set({
            players,
            kills,
            currentThrows: [],
            lastTurns: { ...s.lastTurns, [p.id]: currentThrows },
            status: "win_pending",
            winnerId: winner.id,
            finishedAt: Date.now(),
            podium: [winner.id],
            history: [...s.history, snapshot],
            killerTurnFlags,
            turn: { playerIndex, dartIndex: 0 },
          });
          get().finalizeWinner(winner.id);
          return;
        }
      }

      const nextIdx = nextAliveIndex(playerIndex);
      const nextPlayer = players[nextIdx];

      set({
        players,
        kills,
        currentThrows: [],
        lastTurns: { ...s.lastTurns, [p.id]: currentThrows },
        turn: { playerIndex: nextIdx, dartIndex: 0 },
        history: [...s.history, snapshot],
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
        currentThrows,
        turn: { ...s.turn, dartIndex: nextDart },
        history: [...s.history, snapshot],
        killerTurnFlags,
      });
    }
  },

  undoKiller() {
    const s = get();
    const prev = s.history[s.history.length - 1];
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
      history: s.history.slice(0, -1),
    });
  },
});
