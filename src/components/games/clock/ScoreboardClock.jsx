import { useGameStore } from "../../../store";
import { useActivePlayerViewportBias } from "../../../hooks/useActivePlayerViewportBias";
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

export function ClockScoreBoard({ ...props }) {
  const {
    currentPlayerId,
    currentThrows,
    players,
    activeIndex,
    scores,
    lastTurns,
    finished,
    winnerId,
    podium,
  } = props;

  const { playersOrdered, getItemRef } = useActivePlayerViewportBias({
    players,
    activeIndex,
    finished: !!finished,
    currentPlayerId,
    bottomSafeAreaPx: 260,
    ordering: "rotate-end",
  });

  const clockBonusTick = useGameStore((s) => s.clockBonusTick);
  const bonusActive =
    clockBonusTick && Date.now() - clockBonusTick < 2400 ? true : false;

  return (
    <Board>
      <Cards>
        {playersOrdered.map((p) => {
          const isActive = p.id === currentPlayerId && !finished;
          const throws = isActive ? currentThrows : lastTurns[p.id] || [];
          const pos = Array.isArray(podium) ? podium.indexOf(p.id) : -1;
          const isPendingWinner = winnerId && winnerId === p.id && pos === -1;
          const pendingPlace = (Array.isArray(podium) ? podium.length : 0) + 1;
          const showWinner = winnerId && winnerId === p.id;

          const badge =
            pos >= 0
              ? pos === 0
                ? "Winner"
                : `${pos + 1}. place`
              : showWinner
              ? pendingPlace === 1
                ? "Winner"
                : `${pendingPlace}. place`
              : null;

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
              data-placed={pos >= 0 || isPendingWinner ? "true" : undefined}
              ref={getItemRef(p.id)}
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
