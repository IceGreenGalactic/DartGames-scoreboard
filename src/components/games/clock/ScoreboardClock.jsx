import { useGameStore } from "../../../store";
import {
  Board,
  Cards,
  Card,
  Score,
  Name,
  Boxes,
  Box,
  Badge,
} from "../../general/ScoreBoard.styled";

function formatThrowLabel(t) {
  if (!t) return "";
  if (t.value === 25) return t.mult === 2 ? "D'BULL" : "BULL";
  if (t.value === 0) return "Miss";
  if (t.mult === 3) return `T${t.value}`;
  if (t.mult === 2) return `D${t.value}`;
  return String(t.value);
}

export function ClockScoreBoard({
  currentPlayerId,
  currentThrows,
  players,
  activeIndex,
  scores,
  lastTurns,
  finished,
  winnerId,
  podium,
}) {
  const clockBonusTick = useGameStore((s) => s.clockBonusTick);
  const bonusActive =
    clockBonusTick && Date.now() - clockBonusTick < 2400 ? true : false;

  return (
    <Board>
      <Cards>
        {players.map((p, i) => {
          const isActive = i === activeIndex;
          const throws =
            p.id === currentPlayerId ? currentThrows : lastTurns[p.id] || [];
          const pos = Array.isArray(podium) ? podium.indexOf(p.id) : -1;
          const isPendingWinner = winnerId && winnerId === p.id && pos === -1;
          const pendingPlace = (Array.isArray(podium) ? podium.length : 0) + 1;
          const showWinner = winnerId && winnerId === p.id;

          let badge = null;
          if (pos >= 0) {
            badge = pos === 0 ? "Winner" : `${pos + 1}. place`;
          } else if (showWinner) {
            badge = pendingPlace === 1 ? "Winner" : `${pendingPlace}. place`;
          }

          const paddedThrows = [
            ...throws.map(formatThrowLabel),
            ...Array(3 - throws.length).fill("–"),
          ];

          return (
            <Card
              key={p.id}
              data-active={isActive}
              data-bonus={isActive && bonusActive}
              data-winner={pos === 0 || showWinner}
            >
              <Name>
                {p.name}
                {badge ? <Badge>{badge}</Badge> : null}
                {isActive && bonusActive ? (
                  <Badge data-type="bonus">Bonus Round</Badge>
                ) : null}
              </Name>
              <Score>{scores?.[p.id] ?? 0}</Score>
              <Boxes>
                {paddedThrows.map((label, idx) => (
                  <Box key={idx}>{label}</Box>
                ))}
              </Boxes>
            </Card>
          );
        })}
      </Cards>
    </Board>
  );
}
