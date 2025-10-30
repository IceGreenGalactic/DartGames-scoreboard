import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export function useActiveScrollBias({
  players,
  activeIndex,
  finished = false,
  currentPlayerId,
  maxLandscapeHeight = 520,
}) {
  const getMQ = () =>
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

  const [shouldBias, setShouldBias] = useState(getMQ().matches);

  useEffect(() => {
    const mq = getMQ();
    const onChange = (e) => setShouldBias(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [maxLandscapeHeight]);

  const reordered = useMemo(() => {
    if (!shouldBias || finished || !players?.[activeIndex])
      return players || [];
    const active = players[activeIndex];
    return players.filter((p) => p.id !== active.id).concat(active);
  }, [players, activeIndex, shouldBias, finished]);

  const didReorder = shouldBias && !finished && !!players?.[activeIndex];
  const activeRef = useRef(null);

  useLayoutEffect(() => {
    if (!didReorder || !activeRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: "auto",
      block: "end",
      inline: "nearest",
    });
  }, [currentPlayerId, didReorder, shouldBias]);

  useEffect(() => {
    if (didReorder || !activeRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [currentPlayerId, didReorder, shouldBias]);

  const getItemRef = (playerId) =>
    playerId === currentPlayerId ? activeRef : null;

  return { playersOrdered: reordered, getItemRef, shouldBias };
}
