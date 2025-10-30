import {
  Board,
  Cards,
  Card,
  Score,
  Name,
  Boxes,
  Box,
} from "../../general/ScoreBoard.styled";
import { useActiveScrollBias } from "../../../hooks/useActiveScrollBias";

function formatProgress(lives) {
  if (lives <= -2) return "Dead";
  if (lives === -1) return "-1";
  if (lives === 0) return "0";
  if (lives === 1) return "X";
  if (lives === 2) return "XX";
  return "XXX (Killer)";
}

function sumThrow(t) {
  if (!t) return "—";
  if (t.value === 0) return "Miss";
  if (t.value === 25 && t.mult === 2) return "DBull";
  if (t.value === 25) return "Bull";
  if (t.mult === 2) return `D${t.value}`;
  if (t.mult === 3) return `T${t.value}`;
  return String(t.value);
}

export function KillerScoreBoard({
  players,
  currentPlayerId,
  currentThrows,
  lastTurns = {},
  activeIndex,
  finished = false,
}) {
  const idx =
    typeof activeIndex === "number"
      ? activeIndex
      : Math.max(
          0,
          players.findIndex((p) => p.id === currentPlayerId)
        );

  const { playersOrdered, getItemRef } = useActiveScrollBias({
    players,
    activeIndex: idx,
    finished,
    currentPlayerId,
    bottomSafeAreaPx: 260,
    ordering: "rotate-end",
  });

  return (
    <Board>
      <Cards>
        {playersOrdered.map((p) => {
          const isActive = p.id === currentPlayerId && !finished;
          const showThrows = isActive
            ? currentThrows || []
            : lastTurns[p.id] || [];

          return (
            <Card key={p.id} data-active={isActive} ref={getItemRef(p.id)}>
              <Score>{p.target}</Score>
              <Name>{p.name}</Name>
              <div>{formatProgress(p.lives)}</div>
              <Boxes>
                {Array.from({ length: 3 }, (_, i) => {
                  const t = showThrows[i];
                  return <Box key={i}>{sumThrow(t)}</Box>;
                })}
              </Boxes>
              {p.kills > 0 && <div>Kills: {p.kills}</div>}
            </Card>
          );
        })}
      </Cards>
    </Board>
  );
}
