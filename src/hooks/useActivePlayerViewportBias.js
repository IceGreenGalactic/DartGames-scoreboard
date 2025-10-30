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
        : { matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} },
    smallLandscape:
      typeof window !== "undefined"
        ? window.matchMedia(`(orientation: landscape) and (max-height: ${maxLandscapeHeight}px)`)
        : { matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} },
  });

  const { landscape, smallLandscape } = getMQ();
  const [isLandscape, setIsLandscape] = useState(landscape.matches);
  const [isSmallLandscape, setIsSmallLandscape] = useState(smallLandscape.matches);

  useEffect(() => {
    const { landscape: lmq, smallLandscape: smq } = getMQ();
    const onL = (e) => setIsLandscape(e.matches ?? e.currentTarget?.matches ?? false);
    const onS = (e) => setIsSmallLandscape(e.matches ?? e.currentTarget?.matches ?? false);

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
  const [hiddenNearKeyboard, setHiddenNearKeyboard] = useState(false);

  const checkHidden = () => {
    const el = activeRef.current;
    if (!el || typeof window === "undefined") return false;
    const r = el.getBoundingClientRect();
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const threshold = vh - bottomSafeAreaPx - 8; // “over” keyboard
    return r.bottom > threshold || r.top < 0;
  };

  useEffect(() => {
    // Kun IntersectionObserver, ingen scroll-lyttere
    let t = 0;
    const obs =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            () => {
              clearTimeout(t);
              t = window.setTimeout(() => setHiddenNearKeyboard(checkHidden()), 100);
            },
            {
              root: null,
              rootMargin: `0px 0px -${bottomSafeAreaPx + 8}px 0px`,
              threshold: [0, 1],
            }
          )
        : null;

    const el = activeRef.current;
    if (obs && el) obs.observe(el);

    const onVVResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => setHiddenNearKeyboard(checkHidden()), 100);
    };
    window.visualViewport?.addEventListener?.("resize", onVVResize);

    return () => {
      clearTimeout(t);
      if (obs && el) obs.unobserve(el);
      obs?.disconnect?.();
      window.visualViewport?.removeEventListener?.("resize", onVVResize);
    };
  }, [bottomSafeAreaPx, currentPlayerId]);

  // Bias:
  // - alltid i portrett
  // - i liten landscape
  // - i stor landscape hvis aktiv spiller er skjult nær keyboard
  const shouldBias =
    !finished &&
    !!players?.[activeIndex] &&
    (!isLandscape || isSmallLandscape || hiddenNearKeyboard);

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

  const getItemRef = (playerId) => (playerId === currentPlayerId ? activeRef : null);

  return { playersOrdered, orderMap, getItemRef, shouldBias };
}
