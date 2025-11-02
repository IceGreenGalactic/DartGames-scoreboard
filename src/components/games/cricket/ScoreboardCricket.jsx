import { useActivePlayerViewportBias } from "../../../hooks/useActivePlayerViewportBias";
import { Name, Boxes, Box, Badge } from "../../general/ScoreBoard.styled";
import { CRICKET_ORDER } from "../../../store/lib/cricketCore";
import {
  CricketBoard as Board,
  CricketCards as Cards,
  CricketCard as Card,
  MarksGrid,
  MarkRow,
  MarkKey,
  MarkCell,
  ThrowsBoxes,
  SlashIcon,
  TimesIcon,
  CloseIcon,
} from "./ScoreboardCricket.styled";

function CricketMark({ n }) {
  if (n >= 3) return <CloseIcon />;
  if (n === 2) return <TimesIcon />;
  if (n === 1) return <SlashIcon />;
  return "–";
}

function formatThrowLabel(t) {
  if (!t) return "–";
  if (t.value === 25) return t.mult === 2 ? "D'BULL" : "BULL";
  if (t.value === 0) return "Miss";
  if (t.mult === 3) return `T${t.value}`;
  if (t.mult === 2) return `D${t.value}`;
  return String(t.value);
}

export function CricketScoreBoard(props) {
  const {
    players,
    currentPlayerId,
    activeIndex,
    scores,
    marks,
    lastTurns,
    currentThrows,
    winnerId,
    podium,
  } = props;

  const { playersOrdered, getItemRef, getListRef } =
    useActivePlayerViewportBias({
      players,
      activeIndex,
      finished: false,
      currentPlayerId,
      bottomSafeAreaPx: 260,
      ordering: "rotate-end",
    });

  return (
    <Board>
      <Cards ref={getListRef()}>
        {playersOrdered.map((p) => {
          const pos = Array.isArray(podium) ? podium.indexOf(p.id) : -1;
          const showWinner = winnerId && winnerId === p.id;
          const badge =
            pos >= 0
              ? pos === 0
                ? "Winner"
                : `${pos + 1}. place`
              : showWinner
              ? "Winner"
              : null;

          const m = (marks && marks[p.id]) || {};
          const isActive = p.id === currentPlayerId;
          const throws = isActive ? currentThrows || [] : lastTurns[p.id] || [];
          const padded = [
            ...throws.map(formatThrowLabel),
            ...Array(Math.max(0, 3 - throws.length)).fill("–"),
          ];

          return (
            <Card
              key={p.id}
              data-active={isActive}
              data-winner={pos === 0 || showWinner}
              data-placed={pos >= 0 || showWinner ? "true" : undefined}
              ref={getItemRef(p.id)}
            >
              <Name>
                {p.name}
                {badge ? <Badge>{badge}</Badge> : null}
              </Name>

              <MarksGrid>
                {CRICKET_ORDER.map((k) => (
                  <MarkRow key={k}>
                    <MarkKey>{k === "BULL" ? "Bull" : k}</MarkKey>
                    <MarkCell>
                      <CricketMark n={m[k] || 0} />
                    </MarkCell>
                  </MarkRow>
                ))}
              </MarksGrid>

              <ThrowsBoxes as={Boxes}>
                {padded.map((label, idx) => (
                  <Box key={idx}>{label}</Box>
                ))}
              </ThrowsBoxes>
            </Card>
          );
        })}
      </Cards>
    </Board>
  );
}
