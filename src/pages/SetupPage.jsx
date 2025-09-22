import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { Title, Row, Actions } from "./SetupPage.styled";
import { useGameStore } from "../store/gameStore";

export function SetupPage() {
  useTitle("DartGames • Setup");
  const [players, setPlayers] = useState([""]);
  const setPlayersStore = useGameStore((s) => s.setPlayers);
  const startGame501 = useGameStore((s) => s.startGame501);
  const nav = useNavigate();

  function start() {
    setPlayersStore(players);
    startGame501();
    nav("/play/501");
  }

  return (
    <>
      <Title>Add players</Title>
      {players.map((p, i) => (
        <Row key={i}>
          <input
            className="form-control"
            placeholder={`Player ${i + 1}`}
            value={p}
            onChange={(e) => {
              const next = [...players];
              next[i] = e.target.value;
              setPlayers(next);
            }}
          />
          {i > 0 && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setPlayers(players.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          )}
        </Row>
      ))}
      <Actions>
        <button
          className="btn btn-outline-light"
          onClick={() => setPlayers([...players, ""])}
        >
          + Add
        </button>
        <button className="btn btn-success" onClick={start}>
          Start 501
        </button>
      </Actions>
    </>
  );
}
