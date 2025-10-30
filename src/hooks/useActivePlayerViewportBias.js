import { useEffect, useMemo, useRef, useState } from "react";

export function useActivePlayerViewportBias({
  players,
  activeIndex,
  finished = false,
  currentPlayerId,
  maxLandscapeHeight = 520,
  bottomSafeAreaPx = 0,
  enableDynamicBias = true,
  ordering = "rotate-end",
}) {
  const getLandscapeMQ = () =>
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
        };

  const [landscapeBias, setLandscapeBias] = useState(getLandscapeMQ().matches);
  const [dynamicBias, setDynamicBias] = useState(false);

  useEffect(() => {
    const mq = getLandscapeMQ();
    const onChange = (e) => setLandscapeBias(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [maxLandscapeHeight]);

  const activeRef = useRef(null);

  const checkHidden = () => {
    const el = activeRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const threshold = vh - bottomSafeAreaPx - 8;
    return r.bottom > threshold || r.top < 0;
  };

  useEffect(() => {
    if (!enableDynamicBias) return;
    let t = 0;
    const obs =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            () => {
              clearTimeout(t);
              t = window.setTimeout(() => setDynamicBias(checkHidden()), 120);
            },
            {
              root: null,
              rootMargin: `0px 0px -${bottomSafeAreaPx + 8}px 0px`,
              threshold: [0, 0.99, 1],
            }
          )
        : null;

    const el = activeRef.current;
    if (obs && el) obs.observe(el);

    const onResizeScroll = () => {
      clearTimeout(t);
      t = window.setTimeout(() => setDynamicBias(checkHidden()), 80);
    };

    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, { passive: true });
    window.visualViewport?.addEventListener?.("resize", onResizeScroll);

    return () => {
      clearTimeout(t);
      if (obs && el) obs.unobserve(el);
      obs?.disconnect?.();
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll);
      window.visualViewport?.removeEventListener?.("resize", onResizeScroll);
    };
  }, [enableDynamicBias, bottomSafeAreaPx, currentPlayerId]);

  const shouldBias =
    !finished && !!players?.[activeIndex] && (landscapeBias || dynamicBias);

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

  const getItemRef = (playerId) =>
    playerId === currentPlayerId ? activeRef : null;

  return { playersOrdered, orderMap, getItemRef, shouldBias };
}
