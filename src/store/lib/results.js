export function formatDuration(ms) {
  if (!ms || ms < 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m || h) parts.push(`${m}m`);
  parts.push(`${sec}s`);
  return parts.join(" ");
}

function formatClockReachedLabel(scoreCell) {
  if (scoreCell == null) return "-";
  const s = String(scoreCell);

  if (/^Bx?3$/i.test(s)) return "B3";
  if (/^Bx?2$/i.test(s)) return "B2";
  if (/^Bx?1$/i.test(s) || /^Bull$/i.test(s)) return "B1";
  if (s === "D") return "D";
  if (s === "T") return "T";
  if (/^\d+$/.test(s)) return s;
  return s;
}

function hitSummaryFromRuntime(pp) {
  if (!pp) return "";
  const parts = [];
  if (pp.triples) parts.push(`T${pp.triples}`);
  if (pp.doubles) parts.push(`D${pp.doubles}`);
  if (pp.doubleBulls) parts.push(`DB${pp.doubleBulls}`);
  else if (pp.bulls) parts.push(`B${pp.bulls}`);
  return parts.join(" ");
}

export function buildResults({
  gameId,
  players,
  podium,
  finishTimes,
  gameStartedAt,
  gameFinishedAt,
  scores,
  killsMap,
  winnerId,
  eliminationLog,

  runtimePerPlayer,
  targetsClock,
}) {
  const playerIds = new Set(players.map((p) => p.id));

  const sortedFinishIds = Object.keys(finishTimes || {}).sort((a, b) => {
    const ta = finishTimes?.[a] ?? Infinity;
    const tb = finishTimes?.[b] ?? Infinity;
    if (gameId === "killer") return tb - ta;
    return ta - tb;
  });

  const finishedOrderIds = [...(podium || []), ...sortedFinishIds]
    .filter((id, idx, arr) => id && arr.indexOf(id) === idx)
    .filter((id) => playerIds.has(id));

  const killedByMap = {};
  if (gameId === "killer") {
    (Array.isArray(eliminationLog) ? eliminationLog : []).forEach((e) => {
      if (!killedByMap[e.victim] && e.by) killedByMap[e.victim] = e.by;
    });
  }

  const results = finishedOrderIds.map((id, i) => {
    const p = players.find((x) => x.id === id);
    const rawScore =
      gameId === "killer" ? killsMap?.[p?.name] || 0 : scores?.[id] ?? 0;
    const t = finishTimes?.[id] ?? (gameFinishedAt || Date.now());
    const dur = formatDuration(t - gameStartedAt);

    const pp = runtimePerPlayer?.[id];
    const darts = pp?.darts || null;
    const hitSummary = hitSummaryFromRuntime(pp);
    const reachedLabel = formatClockReachedLabel(scores?.[id]);

    let killedByName = null;
    if (gameId === "killer" && id !== winnerId) {
      const byId = killedByMap[id];
      killedByName = byId
        ? players.find((x) => x.id === byId)?.name || null
        : null;
    }

    return {
      place: i + 1,
      id,
      name: p?.name ?? "—",
      score: rawScore,
      dur,
      killedByName,
      darts,
      hitSummary,
      reachedLabel,
    };
  });

  const remaining = players
    .filter((p) => !finishedOrderIds.includes(p.id))
    .map((p) => {
      const pp = runtimePerPlayer?.[p.id];
      return {
        id: p.id,
        name: p.name,
        score:
          gameId === "killer" ? killsMap?.[p.name] || 0 : scores?.[p.id] ?? 0,

        darts: pp?.darts || null,
        hitSummary: hitSummaryFromRuntime(pp),
        reachedLabel: formatClockReachedLabel(scores?.[p.id]),
      };
    });

  return { results, remaining };
}

export function formatResultMeta(gameId, row, isRemaining = false) {
  if (gameId === "killer") {
    const bits = [];
    bits.push(isRemaining ? "N/C" : row.dur);
    if (row.score) bits.push(`${row.score} kills`);
    if (!isRemaining && row.killedByName)
      bits.push(`killed by ${row.killedByName}`);
    return bits.join(" • ");
  }

  if (gameId === "clock") {
    if (isRemaining) {
      const parts = ["N/C"];
      if (row?.reachedLabel) parts.push(`reached ${row.reachedLabel}`);
      if (row?.darts) parts.push(`${row.darts} darts`);
      return parts.join(" • ");
    } else {
      const parts = [row.dur];
      if (row?.darts) parts.push(`${row.darts} darts`);
      if (row?.hitSummary) parts.push(row.hitSummary);
      return parts.join(" • ");
    }
  }

  return isRemaining
    ? `${row.score} pts • N/C`
    : `${row.score} pts • ${row.dur}`;
}
