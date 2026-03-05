import { useState, useEffect } from "react";
import {
  Backdrop,
  ModalCard,
  Title,
  Section,
  Input,
  Actions,
  ToggleRow,
  ToggleInput,
  ToggleLabel,
  PlayerRow,
  PlayerName,
} from "../../general/PlayerSetupModal.styled";
import { useGameStore } from "../../../store";

export function KillerSetupModal({ isOpen, onClose, onConfirm }) {
  const selected = useGameStore((s) => s.selectedPlayers);
  const [numbers, setNumbers] = useState([]);
  const [doubleIn, setDoubleIn] = useState(false);
  const [selfKill, setSelfKill] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setNumbers(Array.from({ length: selected.length }, () => ""));
      setDoubleIn(false);
      setSelfKill(true);
    }
  }, [isOpen, selected]);

  const minPlayersOk = selected.length >= 2;

  const allChosen =
    numbers.length === selected.length &&
    numbers.every((n) => n && n >= 1 && n <= 20);

  const uniqueNumbersOk =
    allChosen && new Set(numbers.map((n) => Number(n))).size === numbers.length;

  const canStart = minPlayersOk && allChosen && uniqueNumbersOk;

  let errorText = "";
  if (!minPlayersOk) errorText = "Killer requires at least 2 players.";
  else if (allChosen && !uniqueNumbersOk)
    errorText = "Each player must have a unique number.";

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>Killer Setup</Title>

        <Section>
          {selected.map((name, i) => (
            <PlayerRow key={i}>
              <PlayerName>{name}</PlayerName>
              <Input
                type="number"
                min="1"
                max="20"
                placeholder="Number"
                value={numbers[i] || ""}
                onChange={(e) => {
                  const next = [...numbers];
                  next[i] = e.target.value ? parseInt(e.target.value, 10) : "";
                  setNumbers(next);
                }}
              />
            </PlayerRow>
          ))}
        </Section>

        {errorText && (
          <div style={{ marginTop: 8, opacity: 0.9 }}>{errorText}</div>
        )}

        <ToggleRow>
          <ToggleInput
            id="doubleIn"
            type="checkbox"
            checked={doubleIn}
            onChange={(e) => setDoubleIn(e.target.checked)}
          />
          <ToggleLabel htmlFor="doubleIn">Require double-in</ToggleLabel>
        </ToggleRow>

        <ToggleRow>
          <ToggleInput
            id="selfKill"
            type="checkbox"
            checked={selfKill}
            onChange={(e) => setSelfKill(e.target.checked)}
          />
          <ToggleLabel htmlFor="selfKill">Self-kill</ToggleLabel>
        </ToggleRow>

        <Actions>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-success"
            disabled={!canStart}
            onClick={() =>
              onConfirm(selected, numbers, {
                doubleIn,
                selfKill,
              })
            }
          >
            Start Killer
          </button>
        </Actions>
      </ModalCard>
    </Backdrop>
  );
}
