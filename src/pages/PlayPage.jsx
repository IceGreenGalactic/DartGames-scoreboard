import { Link, useParams } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { Keyboard } from "../components/general/Keyboard";
import { ScoreBoard } from "../components/general/ScoreBoard";
import { Title } from "./PlayPage.styled";
import { useGameStore } from "../store/gameStore";

export function PlayPage() {
  const { gameId } = useParams();
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

  return (
    <>
      <Title>
        <h1>{gameId?.toUpperCase?.()}</h1>
        <p>
          {status === "finished"
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
      />
      <Keyboard
        onThrow={throwDart}
        onUndo={undo}
        disabled={status !== "in_progress"}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Link className="btn btn-outline-light" to="/">
          Home
        </Link>
      </div>
    </>
  );
}
