import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTitle } from "../hooks/useTitle";
import { useGameStore } from "../store";
import { games } from "../constants/games";
import { KillerSetupModal } from "../components/games/killer/KillerSetupModal";
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

  const renameRecent = useGameStore((s) => s.renameRecent);
  const deleteRecent = useGameStore((s) => s.deleteRecent);

  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [killerOpen, setKillerOpen] = useState(false);

  function start(gameId) {
    if (selected.length < 1) {
      alert("Select at least one player");
      return;
    }
    if (gameId === "killer") {
      setKillerOpen(true);
      return;
    }
    addToRecent(selected);
    setPlayersFromSelected();
    startGame(gameId);
    nav(`/play/${gameId}`);
  }

  function beginEdit(name) {
    setEditing(name);
    setEditValue(name);
  }
  function cancelEdit() {
    setEditing(null);
    setEditValue("");
  }
  function saveEdit() {
    const v = editValue.trim();
    if (!editing || !v) {
      cancelEdit();
      return;
    }
    renameRecent(editing, v);
    setEditing(null);
    setEditValue("");
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
          <button className="btn muted" onClick={resetGame}>
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
                .map((n) => {
                  const isActive = selected.includes(n);
                  const isEditing = editing === n;
                  return (
                    <RecentChip
                      key={n}
                      data-active={isActive}
                      onClick={() => !isEditing && toggleSelect(n)}
                      title={isActive ? "Remove" : "Add"}
                    >
                      {isEditing ? (
                        <>
                          <input
                            className="chip-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                          />
                          <div className="actions">
                            <button
                              className="iconbtn ok"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEdit();
                              }}
                              aria-label="Save"
                            >
                              ✓
                            </button>
                            <button
                              className="iconbtn"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEdit();
                              }}
                              aria-label="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="name">{n}</span>
                          <div className="actions">
                            <button
                              className="iconbtn"
                              onClick={(e) => {
                                e.stopPropagation();
                                beginEdit(n);
                              }}
                              aria-label="Edit"
                              title="Edit"
                            >
                              ✎
                            </button>
                            <button
                              className="iconbtn danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRecent(n);
                              }}
                              aria-label="Delete"
                              title="Delete"
                            >
                              🗑
                            </button>
                          </div>
                        </>
                      )}
                    </RecentChip>
                  );
                })}
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
              {games.map((g) => (
                <GameBtn key={g.id} onClick={() => start(g.id)}>
                  {g.title}
                </GameBtn>
              ))}
            </Games>
            <Actions>
              <Link className="btn btn-outline-secondary" to="/setup">
                Setup page
              </Link>
            </Actions>
          </StepBody>
        </Step>
      </StepsRow>

      <KillerSetupModal
        isOpen={killerOpen}
        onClose={() => setKillerOpen(false)}
        onConfirm={(names, numbers) => {
          addToRecent(names);
          startGame("killer", names, numbers);
          setKillerOpen(false);
          nav("/play/killer");
        }}
      />
    </PageWrap>
  );
}
