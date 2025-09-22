import { useEffect, useMemo, useState } from "react";
import {
  Backdrop,
  ModalCard,
  Title,
  Section,
  Grid,
  Input,
  Actions,
  Pill,
  Pills,
  Small,
} from "./PlayerSetupModal.styled";
import { useGameStore } from "../../store/gameStore";

export function PlayerSetupModal({ isOpen, onClose, onConfirm }) {
  const recent = useGameStore((s) => s.recentPlayers);
  const addToRecent = useGameStore((s) => s.addToRecent);
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(["", ""]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCount(2);
      setNames(["", ""]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 2)
      setNames(Array.from({ length: count }, (_, i) => names[i] || ""));
  }, [step, count]);

  const canConfirm = useMemo(
    () => names.filter(Boolean).length === count,
    [names, count]
  );

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>Start 501</Title>

        {step === 1 && (
          <>
            <Section>
              <label>Number of players</label>
              <Grid>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    className={`btn ${
                      count === n ? "btn-success" : "btn-outline-light"
                    }`}
                    onClick={() => setCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </Grid>
            </Section>

            {recent?.length > 0 && (
              <Section>
                <label>Recent players</label>
                <Pills>
                  {recent
                    .slice(-20)
                    .reverse()
                    .map((r) => (
                      <Pill
                        key={r}
                        onClick={() => {
                          const next = [...names];
                          for (let i = 0; i < count; i++) {
                            if (!next[i]) {
                              next[i] = r;
                              break;
                            }
                          }
                          setNames(next);
                          setStep(2);
                        }}
                      >
                        {r}
                      </Pill>
                    ))}
                </Pills>
                <Small>
                  Click a name to prefill the list. You can edit later.
                </Small>
              </Section>
            )}

            <Actions>
              <button className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Next
              </button>
            </Actions>
          </>
        )}

        {step === 2 && (
          <>
            <Section>
              <label>Player names</label>
              {Array.from({ length: count }, (_, i) => (
                <Input
                  key={i}
                  placeholder={`Player ${i + 1}`}
                  value={names[i] || ""}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                />
              ))}
            </Section>

            <Actions>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="btn btn-success"
                disabled={!canConfirm}
                onClick={() => {
                  addToRecent(names);
                  onConfirm(names);
                }}
              >
                Start
              </button>
            </Actions>
          </>
        )}
      </ModalCard>
    </Backdrop>
  );
}
