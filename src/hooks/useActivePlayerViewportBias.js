import { useEffect, useMemo, useRef, useState } from "react";

export function useActivePlayerViewportBias({
  players,
  activeIndex,
  finished = false,
  currentPlayerId,
  maxLandscapeHeight = 520,
  bottomSafeAreaPx = 0,
  ordering = "rotate-end",
}) {
  const getMQ = () => ({
    landscape:
      typeof window !== "undefined"
        ? window.matchMedia(`(orientation: landscape)`)
        : {
            matches: false,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
          },
    smallLandscape:
      typeof window !== "undefined"
        ? window.matchMedia(
            `(orientation: landscape) and (max-height: ${maxLandscapeHeight}px)`
          )
        : {
            matches: false,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
          },
  });

  const { landscape, smallLandscape } = getMQ();
  const [isLandscape, setIsLandscape] = useState(landscape.matches);
  const [isSmallLandscape, setIsSmallLandscape] = useState(
    smallLandscape.matches
  );

  useEffect(() => {
    const { landscape: lmq, smallLandscape: smq } = getMQ();
    const onL = (e) =>
      setIsLandscape(e.matches ?? e.currentTarget?.matches ?? false);
    const onS = (e) =>
      setIsSmallLandscape(e.matches ?? e.currentTarget?.matches ?? false);
    if (lmq.addEventListener) lmq.addEventListener("change", onL);
    else lmq.addListener(onL);
    if (smq.addEventListener) smq.addEventListener("change", onS);
    else smq.addListener(onS);
    return () => {
      if (lmq.removeEventListener) lmq.removeEventListener("change", onL);
      else lmq.removeListener(onL);
      if (smq.removeEventListener) smq.removeEventListener("change", onS);
      else smq.removeListener(onS);
    };
  }, [maxLandscapeHeight]);

  const activeRef = useRef(null);
  const listRef = useRef(null);
  const getItemRef = (playerId) =>
    playerId === currentPlayerId ? activeRef : null;
  const getListRef = () => listRef;

  const [needBiasForTurn, setNeedBiasForTurn] = useState(false);
  const [listTooTall, setListTooTall] = useState(false);

  useEffect(() => {
    if (finished || !players?.[activeIndex]) {
      setNeedBiasForTurn(false);
      setListTooTall(false);
      return;
    }

    let r1 = 0,
      r2 = 0;
    const measure = () => {
      const el = activeRef.current;
      const list = listRef.current;

      const vv = window.visualViewport;
      const vh = vv?.height ?? window.innerHeight;
      const vTop = vv?.offsetTop ?? 0;
      const vBottom = vTop + vh;
      const bottomLimit = vBottom - 8;

      let fitsAll = false;
      if (list) {
        const rl = list.getBoundingClientRect();
        fitsAll = rl.top >= vTop && rl.bottom <= bottomLimit;
      }

      let need = false;
      if (!fitsAll && el) {
        const re = el.getBoundingClientRect();
        const band = 28;
        const inBand =
          re.bottom >= bottomLimit - band - bottomSafeAreaPx &&
          re.bottom <= bottomLimit;
        const offscreen = re.bottom > bottomLimit || re.top < vTop;
        need = offscreen || !inBand;
      }

      setListTooTall(!fitsAll);
      setNeedBiasForTurn(need);
    };

    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(measure);
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [
    activeIndex,
    currentPlayerId,
    finished,
    isLandscape,
    isSmallLandscape,
    bottomSafeAreaPx,
    players,
  ]);

  const shouldBias =
    !finished && !!players?.[activeIndex] && listTooTall && needBiasForTurn;

  const rotateFrom = (arr, startIdx) => {
    const n = arr?.length ?? 0;
    if (!n) return [];
    const i = ((startIdx % n) + n) % n;
    return arr.slice(i).concat(arr.slice(0, i));
  };

  const playersOrdered = useMemo(() => {
    if (!players?.length) return [];
    if (!shouldBias || !players[activeIndex]) return players;
    if (ordering === "rotate-start") return rotateFrom(players, activeIndex);
    if (ordering === "rotate-end") return rotateFrom(players, activeIndex + 1);
    const active = players[activeIndex];
    return players.filter((p) => p.id !== active.id).concat(active);
  }, [players, activeIndex, shouldBias, ordering]);

  const orderMap = useMemo(() => {
    const base = playersOrdered?.length ? playersOrdered : players || [];
    const map = new Map();
    for (let i = 0; i < base.length; i++) map.set(base[i].id, i);
    return map;
  }, [playersOrdered, players]);

  return { playersOrdered, orderMap, getItemRef, getListRef, shouldBias };
}
