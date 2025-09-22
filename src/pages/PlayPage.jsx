import { Link, useParams, useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { Keyboard } from "../components/general/Keyboard";
import { ScoreBoard } from "../components/general/ScoreBoard";
import {
  Title,
  ResultsCard,
  ResultsHeader,
  ResultsList,
  ResultsActions,
  ResultMeta,
} from "./PlayPage.styled";
import { useGameStore } from "../store";
import { rulesByGame } from "../components/rules";
import { WinnerModal } from "../components/general/WinnerModal";

function formatDuration(ms) {
  if (!ms || ms < 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m || h) parts.push(`${m}m`);
  parts.push(`${sec}s`);
  return parts.join(" ");
}

export function PlayPage() {
  const { gameId } = useParams();
  const nav = useNavigate();
  useTitle(`DartGames • ${gameId?.toUpperCase?.() ?? "Play"}`);

  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const turn = useGameStore((s) => s.turn);
  const currentThrows = useGameStore((s) => s.currentThrows);
  const lastTurns = useGameStore((s) => s.lastTurns);
  const status = useGameStore((s) => s.status);
  const winnerId = useGameStore((s) => s.winnerId);
  const gameType = useGameStore((s) => s.gameType);
  const throwDart = useGameStore((s) => s.throwDart);
  const undo = useGameStore((s) => s.undo);
  const continueForPlacements = useGameStore((s) => s.continueForPlacements);
  const resetGame = useGameStore((s) => s.resetGame);
  const lastBustAt = useGameStore((s) => s.lastBustAt);
  const finishedIds = useGameStore((s) => s.finishedIds);
  const podium = useGameStore((s) => s.podium);
  const startGame = useGameStore((s) => s.startGame);
  const gameStartedAt = useGameStore((s) => s.gameStartedAt);
  const gameFinishedAt = useGameStore((s) => s.gameFinishedAt);
  const finishTimes = useGameStore((s) => s.finishTimes);

  if (!players.length || gameType !== gameId) {
    return (
      <>
        <Title>
          <h1>{gameId?.toUpperCase?.()}</h1>
        </Title>
        <p>No active game. Go to Home to select players and start.</p>
        <Link className="btn btn-primary" to="/">
          Home
        </Link>
      </>
    );
  }

  const currentPlayer = players[turn.playerIndex];
  const winner = players.find((p) => p.id === winnerId);
  const RulesComp = rulesByGame[gameId] || null;
  const finishGameNow = useGameStore((s) => s.finishGameNow);

  const canThrow = status === "in_progress" || status === "win_pending";
  const currentPlace = (podium?.length || 0) + 1;
  const remainingAfterWinner = players.length - (finishedIds.length + 1);
  const canContinuePlacements =
    status === "win_pending" && remainingAfterWinner > 1;
  const nextPlace = currentPlace + 1;

  const podiumEntries = (podium || []).map((id, i) => {
    const p = players.find((x) => x.id === id);
    const score = scores[id] ?? 0;
    const t = finishTimes?.[id] ?? (gameFinishedAt || Date.now());
    const dur = formatDuration(t - gameStartedAt);
    return {
      place: i + 1,
      id,
      name: p?.name ?? "—",
      score,
      dur,
      completed: true,
    };
  });

  const podiumSet = new Set(podium || []);
  const notCompleted = players
    .filter((p) => !podiumSet.has(p.id))
    .map((p) => {
      const score = scores[p.id] ?? 0;
      return {
        place: null,
        id: p.id,
        name: p.name,
        score,
        dur: null,
        completed: false,
      };
    })
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

  return (
    <>
      <Title>
        <div>
          <h1>{gameId?.toUpperCase?.()}</h1>
          <div>{RulesComp && <RulesComp />}</div>
        </div>
        <p>
          {status === "win_pending"
            ? `Winner: ${winner?.name ?? "-"}`
            : `Player: ${currentPlayer?.name ?? "-"}`}
        </p>
      </Title>

      <ScoreBoard
        currentPlayerId={currentPlayer?.id}
        currentThrows={currentThrows}
        players={players}
        activeIndex={turn.playerIndex}
        scores={scores}
        lastTurns={lastTurns}
        finished={status === "finished"}
        winnerId={winnerId}
        podium={podium}
      />

      <Keyboard
        onThrow={throwDart}
        onUndo={undo}
        disabled={!canThrow}
        bustTick={lastBustAt}
      />

      {status === "finished" && (
        <ResultsCard>
          <ResultsHeader>Results</ResultsHeader>
          <ResultsList>
            {podiumEntries.map((e) => (
              <li key={e.id}>
                <span>{e.place}.</span>
                <span>{e.name}</span>
                <ResultMeta>{`${e.score} pts • ${e.dur}`}</ResultMeta>
              </li>
            ))}
            {notCompleted.length > 0 &&
              notCompleted.map((e) => (
                <li key={e.id}>
                  <span>•</span>
                  <span>{e.name}</span>
                  <ResultMeta>{`${e.score} pts • N/C`}</ResultMeta>
                </li>
              ))}
          </ResultsList>

          <ResultsActions>
            <button
              className="btn btn-outline-light"
              onClick={() => {
                resetGame();
                startGame(gameId);
              }}
            >
              Play again
            </button>

            <button
              className="btn btn-outline-light"
              onClick={() => {
                resetGame();
                nav("/");
              }}
            >
              Back to Home
            </button>
          </ResultsActions>
        </ResultsCard>
      )}

      <WinnerModal
        open={status === "win_pending"}
        winnerName={winner?.name ?? "-"}
        currentPlace={currentPlace}
        nextPlace={nextPlace}
        canContinue={canContinuePlacements}
        onContinue={continueForPlacements}
        onFinish={finishGameNow}
        onExit={() => nav("/")}
      />
    </>
  );
}
