import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { useGameStore } from "../store/gameStore";
import {
  Title,
  Lead,
  PageWrap,
  StepsRow,
  Step,
  StepHeader,
  StepBadge,
  StepTitle,
  StepSub,
  StepBody,
  Row,
  Actions,
  Divider,
  SelectedList,
  SelectedChip,
  RecentWrap,
  RecentChip,
  AddRow,
  Games,
  GameBtn,
} from "./HomePage.styled";

export function HomePage() {
  useTitle("DartGames • Home");
  const nav = useNavigate();

  const status = useGameStore((s) => s.status);
  const gameType = useGameStore((s) => s.gameType);
  const resetGame = useGameStore((s) => s.resetGame);

  const selected = useGameStore((s) => s.selectedPlayers);
  const recent = useGameStore((s) => s.recentPlayers);
  const toggleSelect = useGameStore((s) => s.toggleSelectPlayer);
  const addNew = useGameStore((s) => s.addNewPlayer);
  const setPlayersFromSelected = useGameStore((s) => s.setPlayersFromSelected);
  const startGame = useGameStore((s) => s.startGame);
  const addToRecent = useGameStore((s) => s.addToRecent);

  const [newName, setNewName] = useState("");

  function start(gameId) {
    if (selected.length < 1) {
      alert("Select at least one player");
      return;
    }
    addToRecent(selected);
    setPlayersFromSelected();
    startGame(gameId);
    nav(`/play/${gameId}`);
  }

  return (
    <PageWrap>
      <div>
        <Title>Let’s play darts</Title>
        <Lead>Pick players, then choose a game.</Lead>
      </div>

      {status === "in_progress" && (
        <Row>
          <Link className="btn btn-primary" to={`/play/${gameType || "501"}`}>
            Resume {gameType?.toUpperCase?.() || "GAME"}
          </Link>
          <button className="btn btn-outline-secondary" onClick={resetGame}>
            Clear game
          </button>
        </Row>
      )}
      <StepsRow>
        <Step>
          <StepHeader>
            <StepBadge>1</StepBadge>
            <div>
              <StepTitle>Choose players</StepTitle>
              <StepSub>Select from recent or add new names.</StepSub>
            </div>
          </StepHeader>
          <StepBody>
            <SelectedList>
              {selected.map((n) => (
                <SelectedChip
                  key={n}
                  onClick={() => toggleSelect(n)}
                  title="Remove"
                >
                  {n} ×
                </SelectedChip>
              ))}
              {selected.length === 0 && <span>No players selected</span>}
            </SelectedList>

            <Divider />

            <RecentWrap>
              {recent
                .slice(-50)
                .reverse()
                .map((n) => (
                  <RecentChip
                    key={n}
                    data-active={selected.includes(n)}
                    onClick={() => toggleSelect(n)}
                    title={selected.includes(n) ? "Remove" : "Add"}
                  >
                    {n}
                  </RecentChip>
                ))}
              {recent.length === 0 && <span>No recent players yet</span>}
            </RecentWrap>

            <AddRow>
              <input
                className="form-control"
                placeholder="Add new player"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) {
                    addNew(newName.trim());
                    setNewName("");
                  }
                }}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  if (!newName.trim()) return;
                  addNew(newName.trim());
                  setNewName("");
                }}
              >
                Add
              </button>
            </AddRow>
          </StepBody>
        </Step>

        <Step>
          <StepHeader>
            <StepBadge>2</StepBadge>
            <div>
              <StepTitle>Choose game</StepTitle>
              <StepSub>Games will use the selected players.</StepSub>
            </div>
          </StepHeader>
          <StepBody>
            <Games>
              <GameBtn onClick={() => start("501")}>501</GameBtn>
              <GameBtn onClick={() => start("killer")}>Killer (WIP)</GameBtn>
              <GameBtn onClick={() => start("clock")}>Clock (WIP)</GameBtn>
            </Games>
            <Actions>
              <Link className="btn btn-outline-secondary" to="/setup">
                Setup page
              </Link>
            </Actions>
          </StepBody>
        </Step>
      </StepsRow>
    </PageWrap>
  );
}
