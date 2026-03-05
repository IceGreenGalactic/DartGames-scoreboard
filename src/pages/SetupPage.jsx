import { Link } from "react-router-dom";
import { useTitle } from "../hooks/useTitle"; 
import { useGameStore } from "../store";
import { Wrap, Title, Lead, Actions, Stat, Row } from "./SetupPage.styled";
import { ThemePicker } from "../components/general/ThemePicker";
import { VoicePicker } from "../components/general/VoicePicker";

export function SetupPage() {
  useTitle("DartGames • Setup");
  const resetGame = useGameStore((s) => s.resetGame);
  const recentCount = useGameStore((s) => s.recentPlayers.length);
  const selectedCount = useGameStore((s) => s.selectedPlayers.length);

  return (
    <Wrap>
      <Title>Setup</Title>
      <Lead>Vedlikehold og raske handlinger.</Lead>

      <Row>
        <ThemePicker />
      </Row>
      <Row>
        <VoicePicker />
      </Row>
      <Actions>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Oppdater app
        </button>
        <button className="btn btn-outline-danger" onClick={resetGame}>
          Clear game state
        </button>
        <Link className="btn muted" to="/">
          Til forsiden
        </Link>
      </Actions>

      <Stat>
        <div>Recent players: {recentCount}</div>
        <div>Selected now: {selectedCount}</div>
      </Stat>
    </Wrap>
  );
}
