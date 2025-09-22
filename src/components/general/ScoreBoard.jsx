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
  winnerId,
  podium = [],
}) {
  function placeOf(id) {
    const i = podium.indexOf(id);
    return i >= 0 ? i + 1 : null;
  }

  return (
    <Board>
      <Cards>
        {players.map((p, idx) => {
          const isActive = idx === activeIndex && !finished;
          const showThrows = isActive ? currentThrows : lastTurns[p.id] || [];
          const roundTotal = sumThrows(showThrows);
          const place = placeOf(p.id);
          const isWinner = place === 1;
          const badgeText = place ? (place === 1 ? "Winner" : `${place}. place`) : null;

          return (
            <Card
              key={p.id}
              data-active={isActive}
              data-winner={isWinner}
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
