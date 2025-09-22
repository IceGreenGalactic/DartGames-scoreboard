export function isDoubleThrow(t) {
  if (!t) return false;
  if (t.value === 25 && t.mult === 2) return true;
  return t.mult === 2;
}

export function throwPoints(t) {
  if (!t) return 0;
  if (t.value === 25) return t.mult === 2 ? 50 : 25;
  return (t.value || 0) * (t.mult || 1);
}

export function nextAlivePlayerIndex(players, fromIndex, finishedSet) {
  const n = players.length;
  let i = (fromIndex + 1) % n;
  let guard = 0;
  while (guard < n) {
    const p = players[i];
    if (p && !finishedSet.has(p.id)) return i;
    i = (i + 1) % n;
    guard++;
  }
  return fromIndex;
}

const singles = Array.from({ length: 20 }, (_, i) => i + 1);
const doubles = singles
  .map((v) => ({ v, m: 2, pts: v * 2, k: `D${v}` }))
  .concat([{ v: 25, m: 2, pts: 50, k: "DBULL" }]);
const triples = singles.map((v) => ({ v, m: 3, pts: v * 3, k: `T${v}` }));
const singlesK = singles
  .map((v) => ({ v, m: 1, pts: v, k: `S${v}` }))
  .concat([{ v: 25, m: 1, pts: 25, k: "BULL" }]);

const firstSecondPool = [...triples, ...singlesK];
const rankMap = {};
[
  ..."T20 T19 T18 T17 T16 T15 T14 T13 T12 T11 T10 T9 T8 T7 T6 T5 T4 T3 T2 T1 S20 S19 S18 S17 S16 S15 S14 S13 S12 S11 S10 S9 S8 S7 S6 S5 S4 S3 S2 S1 T20 BULL".split(
    " "
  ),
].forEach((k, i) => (rankMap[k] = i));

function sortRoutes(a, b) {
  const ak = a.map((x) => x.k);
  const bk = b.map((x) => x.k);
  const al = ak.length;
  const bl = bk.length;
  if (al !== bl) return al - bl;
  const aw = ak.reduce((s, k) => s + (rankMap[k] ?? 999), 0);
  const bw = bk.reduce((s, k) => s + (rankMap[k] ?? 999), 0);
  return aw - bw;
}

export function findCheckout(remain, dartsLeft) {
  if (remain <= 1 || dartsLeft <= 0) return [];
  const routes = [];

  function pushIf(sumArr) {
    const pts = sumArr.reduce((s, x) => s + x.pts, 0);
    if (pts === remain) routes.push(sumArr);
  }

  if (dartsLeft >= 1) {
    for (const d of doubles) {
      pushIf([d]);
    }
  }

  if (dartsLeft >= 2) {
    for (const a of firstSecondPool) {
      for (const d of doubles) {
        const pts = a.pts + d.pts;
        if (pts === remain) routes.push([a, d]);
      }
    }
  }

  if (dartsLeft >= 3) {
    for (const a of firstSecondPool) {
      for (const b of firstSecondPool) {
        for (const d of doubles) {
          const pts = a.pts + b.pts + d.pts;
          if (pts === remain) routes.push([a, b, d]);
        }
      }
    }
  }

  routes.sort(sortRoutes);
  return routes;
}

export function formatRoute(route) {
  return route.map((t) => {
    if (t.k === "BULL") return "BULL";
    if (t.k === "DBULL") return "D-BULL";
    return t.k;
  });
}
