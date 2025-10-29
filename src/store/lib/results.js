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

// ---- Cricket helpers ----
const CRICKET_KEYS = ["20", "19", "18", "17", "16", "15", "BULL"];
function countClosed(marksMap) {
  if (!marksMap) return 0;
  let c = 0;
  for (const k of CRICKET_KEYS) if ((marksMap[k] || 0) >= 3) c++;
  return c;
}
function marksProgress(marksMap) {
  if (!marksMap) return 0;
  return CRICKET_KEYS.reduce((s, k) => s + Math.min(3, marksMap[k] || 0), 0);
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
  cricketMarks,
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

  const baseRows = players.map((p) => {
    const t = finishTimes?.[p.id] ?? (gameFinishedAt || Date.now());
    const dur = formatDuration(t - gameStartedAt);

    const pp = runtimePerPlayer?.[p.id];
    const darts = pp?.darts || null;
    const hitSummary = hitSummaryFromRuntime(pp);

    const reachedLabel =
      gameId === "clock" ? formatClockReachedLabel(scores?.[p.id]) : null;

    const myMarks = cricketMarks?.[p.id];
    const closed = gameId === "cricket" ? countClosed(myMarks) : null;
    const progress = gameId === "cricket" ? marksProgress(myMarks) : null;

    let killedByName = null;
    if (gameId === "killer" && p.id !== winnerId) {
      const byId = killedByMap[p.id];
      killedByName = byId
        ? players.find((x) => x.id === byId)?.name || null
        : null;
    }

    return {
      id: p.id,
      name: p.name,
      dur,
      darts,
      hitSummary,
      reachedLabel,
      killedByName,
      killerKills: killsMap?.[p.name] || 0,
      score: scores?.[p.id] ?? 0,
      closed,
      progress,
    };
  });

  const inFinished = new Set(finishedOrderIds);
  const finishedRows = finishedOrderIds
    .map((id) => baseRows.find((r) => r.id === id))
    .filter(Boolean);

  const remainingRows = baseRows.filter((r) => !inFinished.has(r.id));

  let sortedRemaining = remainingRows;
  if (gameId === "cricket") {
    sortedRemaining = remainingRows
      .slice()
      .sort(
        (a, b) =>
          (b.closed || 0) - (a.closed || 0) ||
          (b.progress || 0) - (a.progress || 0) ||
          a.name.localeCompare(b.name)
      );
  } else if (gameId === "clock") {
    const rank = (lab) => {
      const map = { B3: 24, B2: 23, B1: 22, T: 21, D: 20 };
      const n = Number(lab);
      if (!Number.isNaN(n)) return n;
      return map[lab] || 0;
    };
    sortedRemaining = remainingRows
      .slice()
      .sort(
        (a, b) =>
          rank(b.reachedLabel) - rank(a.reachedLabel) ||
          a.name.localeCompare(b.name)
      );
  } else if (gameId === "killer") {
    sortedRemaining = remainingRows
      .slice()
      .sort(
        (a, b) =>
          (b.killerKills || 0) - (a.killerKills || 0) ||
          a.name.localeCompare(b.name)
      );
  } else {
    sortedRemaining = remainingRows
      .slice()
      .sort(
        (a, b) =>
          (a.score || 0) - (b.score || 0) || a.name.localeCompare(b.name)
      );
  }

  const results = finishedRows.map((r, i) => ({ place: i + 1, ...r }));
  const remaining = sortedRemaining.map((r) => ({ ...r }));

  return { results, remaining };
}

export function formatResultMeta(gameId, row, isRemaining = false) {
  if (gameId === "killer") {
    const bits = [];
    bits.push(isRemaining ? "N/C" : row.dur);
    if (row.killerKills) bits.push(`${row.killerKills} kills`);
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

  if (gameId === "cricket") {
    const closedStr =
      typeof row.closed === "number" ? `${row.closed}/7 closed` : null;

    if (isRemaining) {
      const parts = ["N/C"];
      if (closedStr) parts.push(closedStr);
      return parts.join(" • ");
    } else {
      const parts = [row.dur];
      if (closedStr) parts.push(closedStr);
      return parts.join(" • ");
    }
  }

  return isRemaining
    ? `${row.score} pts • N/C`
    : `${row.score} pts • ${row.dur}`;
}
