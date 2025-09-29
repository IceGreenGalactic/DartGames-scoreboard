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

  const allChosen =
    numbers.length === selected.length &&
    numbers.every((n) => n && n >= 1 && n <= 20);

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
            disabled={!allChosen}
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
