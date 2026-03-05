import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { games } from "../constants/games";
import { Keyboard } from "../components/general/Keyboard";
import { ScoreBoard } from "../components/general/ScoreBoard";
import { KillerScoreBoard } from "../components/games/killer/ScoreboardKiller";
import { KillerSetupModal } from "../components/games/killer/KillerSetupModal";
import { ClockScoreBoard } from "../components/games/clock/ScoreboardClock";
import { CricketScoreBoard } from "../components/games/cricket/ScoreboardCricket";
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
import { buildResults, formatResultMeta } from "../store/lib/results";
import TurnScoreAnnouncer from "../components/general/TurnScoreAnnouncer";
import { sfxWin, sfxUnlock } from "../store/lib/sfx";

export function PlayPage() {
  const { gameId } = useParams();
  const nav = useNavigate();
  const [showKillerSetup, setShowKillerSetup] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);

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
  const killsMap = useGameStore((s) => s.kills);
  const eliminationLog = useGameStore((s) => s.eliminationLog);
  const runtimePerPlayer = useGameStore((s) => s.runtime?.perPlayer);
  const cricketMarks = useGameStore((s) => s.cricketMarks);
  const reserveHint = gameId === "501" || gameId === "301";
  const showHint = Array.isArray(checkoutHint) && checkoutHint.length > 0;

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
        <TurnScoreAnnouncer enabledGames={["501", "301"]} />
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

  const decidedCount = Array.isArray(podium)
    ? winnerId && !podium.includes(winnerId)
      ? podium.length + 1
      : podium.length
    : winnerId
      ? 1
      : 0;
  const currentPlace = decidedCount;
  const nextPlace = currentPlace + 1;
  const remainingAfterWinner = players.length - decidedCount;
  const canContinuePlacements =
    gameId !== "killer" && status === "win_pending" && remainingAfterWinner > 1;

  const { results, remaining } = buildResults({
    gameId,
    players,
    podium,
    finishTimes,
    gameStartedAt,
    gameFinishedAt,
    scores,
    killsMap,
    winnerId,
    eliminationLog,
    targetsClock,
    runtimePerPlayer,
    cricketMarks,
  });

  const prevStatus = useRef(status);

  useEffect(() => {
    const was = prevStatus.current;
    prevStatus.current = status;

    if (status !== "win_pending") {
      setWinnerModalOpen(false);
      return;
    }

    if (was === "win_pending") return;

    let cancelled = false;

    const waitForTtsToFinish = () =>
      new Promise((resolve) => {
        const synth = window.speechSynthesis;
        if (!synth) return resolve();

        const start = Date.now();
        const maxMs = 1500;

        const tick = () => {
          if (cancelled) return;
          if (!synth.speaking && !synth.pending) return resolve();
          if (Date.now() - start > maxMs) return resolve();
          setTimeout(tick, 30);
        };

        tick();
      });

    (async () => {
      await waitForTtsToFinish();
      if (cancelled) return;

      sfxUnlock();
      sfxWin();

      setTimeout(() => {
        if (!cancelled) setWinnerModalOpen(true);
      }, 60);
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <>
      <TurnScoreAnnouncer enabledGames={["501", "301"]} />
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

      {gameId === "cricket" ? (
        <CricketScoreBoard
          players={players}
          currentPlayerId={currentPlayer?.id}
          activeIndex={turn.playerIndex}
          scores={scores}
          marks={cricketMarks}
          lastTurns={lastTurns}
          currentThrows={currentThrows}
          winnerId={winnerId}
          podium={podium}
        />
      ) : gameId === "killer" ? (
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

      {reserveHint && (
        <HintArea>
          {showHint && (
            <HintBar>
              {checkoutHint.map((step, i) => (
                <HintSteps key={i}>{step}</HintSteps>
              ))}
            </HintBar>
          )}
        </HintArea>
      )}

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
                <ResultMeta>{formatResultMeta(gameId, e, false)}</ResultMeta>
              </li>
            ))}

            {remaining.map((e) => (
              <li key={e.id}>
                <span>•</span>
                <span>{e.name}</span>
                <ResultMeta>{formatResultMeta(gameId, e, true)}</ResultMeta>
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
        open={winnerModalOpen}
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
