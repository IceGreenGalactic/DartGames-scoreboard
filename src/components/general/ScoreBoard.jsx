import {
  Board,
  Cards,
  Card,
  Score,
  Name,
  Boxes,
  Box,
  RoundSum,
  Badge,
} from "./ScoreBoard.styled";
import { useEffect, useRef } from "react";

function sumThrow(t) {
  if (!t) return 0;
  if (t.value === 0) return 0;
  if (t.value === 25) return t.mult === 2 ? 50 : 25;
  return (t.value || 0) * (t.mult || 1);
}
function sumThrows(arr) {
  return (arr || []).reduce((s, t) => s + sumThrow(t), 0);
}

export function ScoreBoard({
  currentPlayerId,
  currentThrows,
  players,
  activeIndex,
  scores,
  lastTurns,
  finished,
  podium = [],
}) {
  function sumThrow(t) {
    if (!t) return 0;
    if (t.value === 0) return 0;
    if (t.value === 25) return t.mult === 2 ? 50 : 25;
    return (t.value || 0) * (t.mult || 1);
  }
  function sumThrows(arr) {
    return (arr || []).reduce((s, t) => s + sumThrow(t), 0);
  }
  function placeOf(id) {
    const i = podium.indexOf(id);
    return i >= 0 ? i + 1 : null;
  }

  const activeRef = useRef(null);

  const shouldBiasActiveToBottom =
    typeof window !== "undefined" &&
    window.matchMedia("(orientation: landscape) and (max-height: 520px)")
      .matches;

  useEffect(() => {
    if (!activeRef.current) return;
    activeRef.current.scrollIntoView({
      behavior: "smooth",
      block: shouldBiasActiveToBottom ? "end" : "nearest",
    });
  }, [currentPlayerId, shouldBiasActiveToBottom]);

  let orderedPlayers = [...players];
  if (shouldBiasActiveToBottom && !finished && players[activeIndex]) {
    const active = players[activeIndex];
    orderedPlayers = players.filter((p) => p.id !== active.id).concat(active);
  }

  return (
    <Board>
      <Cards>
        {orderedPlayers.map((p) => {
          const isActive = p.id === currentPlayerId && !finished;
          const showThrows = isActive ? currentThrows : lastTurns[p.id] || [];
          const roundTotal = sumThrows(showThrows);
          const place = placeOf(p.id);
          const isWinner = place === 1;
          const badgeText =
            place && (place === 1 ? "Winner" : `${place}. place`);

          return (
            <Card
              key={p.id}
              data-active={isActive}
              data-winner={isWinner}
              ref={isActive ? activeRef : null}
            >
              {badgeText && <Badge>{badgeText}</Badge>}
              <Score>{scores[p.id] ?? 0}</Score>
              <Name>{p.name}</Name>
              <Boxes>
                {Array.from({ length: 3 }, (_, i) => {
                  const t = showThrows[i];
                  const label = !t
                    ? "—"
                    : t.value === 0
                    ? "Miss"
                    : String(sumThrow(t));
                  return <Box key={i}>{label}</Box>;
                })}
              </Boxes>
              <RoundSum>{roundTotal ? `Round: ${roundTotal}` : ""}</RoundSum>
            </Card>
          );
        })}
      </Cards>
    </Board>
  );
}
