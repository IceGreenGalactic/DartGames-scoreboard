import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export function useActiveScrollBias({
  players,
  activeIndex,
  finished = false,
  currentPlayerId,
  maxLandscapeHeight = 520,
  bottomSafeAreaPx = 0,
  enableDynamicBias = true,
  ordering = "rotate-start",
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

  useEffect(() => {
    if (!enableDynamicBias) return;
    let t = 0;
    const obs =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const e = entries[0];
              const hidden = !(
                e?.isIntersecting && e?.intersectionRatio > 0.98
              );
              clearTimeout(t);
              t = window.setTimeout(() => setDynamicBias(hidden), 120);
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

    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => {
        const el2 = activeRef.current;
        if (!el2) return;
        const r = el2.getBoundingClientRect();
        const vh = window.visualViewport?.height ?? window.innerHeight;
        const threshold = vh - bottomSafeAreaPx - 8;
        setDynamicBias(r.bottom > threshold || r.top < 0);
      }, 80);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    window.visualViewport?.addEventListener?.("resize", onResize);

    return () => {
      clearTimeout(t);
      if (obs && el) obs.unobserve(el);
      obs?.disconnect?.();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
      window.visualViewport?.removeEventListener?.("resize", onResize);
    };
  }, [enableDynamicBias, bottomSafeAreaPx, currentPlayerId]);

  const shouldBias =
    !finished && !!players?.[activeIndex] && (landscapeBias || dynamicBias);

  const rotateFrom = (arr, startIdx) => {
    const n = arr.length;
    if (!n) return arr;
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

  const prevBiasRef = useRef(shouldBias);
  useLayoutEffect(() => {
    const becameTrue = !prevBiasRef.current && shouldBias;
    prevBiasRef.current = shouldBias;
    if (!shouldBias || !activeRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: becameTrue ? "auto" : "auto",
      block: "end",
      inline: "nearest",
    });
  }, [currentPlayerId, shouldBias]);

  useEffect(() => {
    if (shouldBias || !activeRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [currentPlayerId, shouldBias]);

  const getItemRef = (playerId) =>
    playerId === currentPlayerId ? activeRef : null;

  return { playersOrdered, getItemRef, shouldBias };
}
