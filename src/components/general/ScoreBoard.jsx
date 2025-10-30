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
import { useActivePlayerViewportBias } from "../../hooks/useActivePlayerViewportBias";

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
  winnerId,
}) {
  function placeOf(id) {
    const i = podium.indexOf(id);
    return i >= 0 ? i + 1 : null;
  }

  const { playersOrdered, getItemRef } = useActivePlayerViewportBias({
    players,
    activeIndex,
    finished: !!finished,
    currentPlayerId,
    bottomSafeAreaPx: 260,
    ordering: "rotate-end",
  });

  return (
    <Board>
      <Cards>
        {playersOrdered.map((p) => {
          const isActive = p.id === currentPlayerId && !finished;
          const showThrows = isActive ? currentThrows : lastTurns[p.id] || [];
          const roundTotal = sumThrows(showThrows);
          const place = placeOf(p.id);
          const isWinner = place === 1;
          const pos = Array.isArray(podium) ? podium.indexOf(p.id) : -1;
          const isPendingWinner = winnerId && winnerId === p.id && pos === -1;
          const pendingPlace = (Array.isArray(podium) ? podium.length : 0) + 1;

          let badgeText = null;
          if (pos >= 0) {
            badgeText = pos === 0 ? "Winner" : `${pos + 1}. place`;
          } else if (isPendingWinner) {
            badgeText =
              pendingPlace === 1 ? "Winner" : `${pendingPlace}. place`;
          }

          return (
            <Card
              key={p.id}
              data-active={isActive}
              data-winner={isWinner}
              data-placed={pos >= 0 || isPendingWinner ? "true" : undefined}
              ref={getItemRef(p.id)}
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
