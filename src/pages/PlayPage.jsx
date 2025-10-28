import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { games } from "../constants/games";
import { Keyboard } from "../components/general/Keyboard";
import { ScoreBoard } from "../components/general/ScoreBoard";
import { KillerScoreBoard } from "../components/games/killer/ScoreboardKiller";
import { KillerSetupModal } from "../components/games/killer/KillerSetupModal";
import { ClockScoreBoard } from "../components/games/clock/ScoreboardClock";
import {
  Title,
  ResultsCard,
  ResultsHeader,
  ResultsList,
  ResultsActions,
  ResultMeta,
  HintBar,
  HintSteps,
  HintArea,
  DoubleOutSwitch,
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
  const [showKillerSetup, setShowKillerSetup] = useState(false);

  useTitle(gameId);

  const players = useGameStore((s) => s.players);
  const scores = useGameStore((s) => s.scores);
  const turn = useGameStore((s) => s.turn);
  const currentThrows = useGameStore((s) => s.currentThrows);
  const lastTurns = useGameStore((s) => s.lastTurns);
  const status = useGameStore((s) => s.status);
  const winnerId = useGameStore((s) => s.winnerId);
  const gameType = useGameStore((s) => s.gameType);
  const continueForPlacements = useGameStore((s) => s.continueForPlacements);
  const resetGame = useGameStore((s) => s.resetGame);
  const lastBustAt = useGameStore((s) => s.lastBustAt);
  const finishedIds = useGameStore((s) => s.finishedIds);
  const podium = useGameStore((s) => s.podium);
  const startGame = useGameStore((s) => s.startGame);
  const gameStartedAt = useGameStore((s) => s.gameStartedAt);
  const gameFinishedAt = useGameStore((s) => s.gameFinishedAt);
  const finishTimes = useGameStore((s) => s.finishTimes);
  const checkoutHint = useGameStore((s) => s.checkoutHint);
  const finishGameNow = useGameStore((s) => s.finishGameNow);
  const targetsClock = useGameStore((s) => s.targetsClock);
  const mustDoubleOut = useGameStore((s) => s.mustDoubleOut);
  const toggleDoubleOut = useGameStore((s) => s.toggleDoubleOut);

  const throwDart =
    gameId === "killer"
      ? useGameStore((s) => s.throwDartKiller)
      : useGameStore((s) => s.throwDart);

  const undo =
    gameId === "killer"
      ? useGameStore((s) => s.undoKiller)
      : useGameStore((s) => s.undo);

  const allowKillerSetupView = gameId === "killer" && showKillerSetup;

  if ((!players.length || gameType !== gameId) && !allowKillerSetupView) {
    return (
      <>
        <Title>
          <h1>
            {games.find((g) => g.id === gameId)?.title ||
              gameId?.toUpperCase?.()}
          </h1>
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

  const canThrow = status === "in_progress" || status === "win_pending";
  const currentPlace = (podium?.length || 0) + 1;
  const remainingAfterWinner = players.length - (finishedIds.length + 1);
  const canContinuePlacements =
    gameId === "killer"
      ? false
      : status === "win_pending" && remainingAfterWinner > 1;
  const nextPlace = currentPlace + 1;

  const finishedOrderIds = [
    ...(podium || []),
    ...Object.keys(finishTimes || {}).sort(
      (a, b) => (finishTimes?.[a] ?? Infinity) - (finishTimes?.[b] ?? Infinity)
    ),
  ].filter((id, idx, arr) => id && arr.indexOf(id) === idx);

  const results = finishedOrderIds.map((id, i) => {
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
    };
  });
  const remaining = players
    .filter((p) => !finishedOrderIds.includes(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      score: scores[p.id] ?? 0,
    }))
    .sort((a, b) => a.score - b.score);

  return (
    <>
      <Title>
        <div>
          <h1>
            {games.find((g) => g.id === gameId)?.title ||
              gameId?.toUpperCase?.()}
          </h1>

          <div>{RulesComp && <RulesComp />}</div>
        </div>
        <p>
          {status === "win_pending"
            ? `Winner: ${winner?.name ?? "-"}`
            : `Player: ${currentPlayer?.name ?? "-"}`}
        </p>
      </Title>

      {gameId === "killer" ? (
        <KillerScoreBoard
          players={players}
          currentPlayerId={currentPlayer?.id}
          currentThrows={currentThrows}
          lastTurns={lastTurns}
        />
      ) : gameId === "clock" ? (
        <ClockScoreBoard
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
      ) : (
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
      )}

      <HintArea>
        {Array.isArray(checkoutHint) && checkoutHint.length > 0 && (
          <HintBar>
            {checkoutHint.map((step, i) => (
              <HintSteps key={i}>{step}</HintSteps>
            ))}
          </HintBar>
        )}
      </HintArea>

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
            {results.map((e) => (
              <li key={e.id}>
                <span>{e.place}.</span>
                <span>{e.name}</span>
                <ResultMeta>{`${e.score} pts • ${e.dur}`}</ResultMeta>
              </li>
            ))}

            {remaining.map((e) => (
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
                if (gameId === "killer") {
                  resetGame(true);
                  setShowKillerSetup(true);
                } else {
                  resetGame(true);
                  startGame(gameId);
                }
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
        onExit={() => {
          const g = useGameStore.getState();
          if (!g.hasLoggedSession && g.winnerId) {
            g.finalizeWinner(g.winnerId);
          }
          nav("/");
        }}
      />

      {gameId === "killer" && (
        <KillerSetupModal
          isOpen={showKillerSetup}
          onClose={() => setShowKillerSetup(false)}
          onConfirm={(names, numbers, options) => {
            startGame("killer", names, numbers, options);
            setShowKillerSetup(false);
          }}
        />
      )}
      {(gameId === "501" || gameId === "301") && (
        <DoubleOutSwitch className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="doubleout"
            checked={!!mustDoubleOut}
            onChange={toggleDoubleOut}
          />
          <label className="form-check-label" htmlFor="doubleout">
            Require double-out
          </label>
        </DoubleOutSwitch>
      )}
    </>
  );
}
