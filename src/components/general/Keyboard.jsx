import { useEffect, useRef, useState } from "react";
import { FaBullseye, FaUndo, FaBan } from "react-icons/fa";
import { Grid, Key, ActionsRow, Wrap } from "./Keyboard.styled";
import { useGameStore } from "../../store";
import {
  sfxPrime,
  sfxTick,
  sfxBull,
  sfxMiss,
  sfxActivated,
  sfxBust,
  sfxUnlock,
  ttsUnlock,
} from "../../store/lib/sfx";

export function Keyboard({
  onThrow,
  onUndo,
  disabled,
  isDisabled,
  isBullDisabled,
  bustTick,
}) {
  const [modifier, setModifier] = useState(1);
  const [bustFlash, setBustFlash] = useState(false);
  const clickGuardAt = useRef(0);
  const primedRef = useRef(false);

  const inputLockUntil = useGameStore((s) => s.inputLockUntil || 0);

  const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    if (!bustTick) return;
    sfxBust();

    setBustFlash(true);
    const t = setTimeout(() => setBustFlash(false), 2050);
    return () => clearTimeout(t);
  }, [bustTick]);

  function guard(fn) {
    if (disabled) return;

    const now = Date.now();
    if (now < inputLockUntil) return;

    sfxUnlock();
    ttsUnlock();

    if (!primedRef.current) {
      primedRef.current = true;
      sfxPrime().catch(() => {});
    }

    if (now - clickGuardAt.current < 160) return;
    clickGuardAt.current = now;

    fn();
  }

  function toggleModifier(next) {
    guard(() => {
      setModifier((m) => {
        const newM = m === next ? 1 : next;

        if ((newM === 2 || newM === 3) && newM !== m) {
          sfxActivated();
        }
        return newM;
      });
    });
  }

  function sendNumber(n) {
    guard(() => {
      if (isDisabled?.(n, modifier)) return;
      sfxTick();
      onThrow({ value: n, mult: modifier });
      setModifier(1);
    });
  }

  function sendBull() {
    guard(() => {
      if (isBullDisabled?.(modifier)) return;
      const mult = modifier === 3 ? 1 : modifier;
      sfxBull();
      onThrow({ value: 25, mult });
      setModifier(1);
    });
  }

  function miss() {
    guard(() => {
      sfxMiss();
      onThrow({ value: 0, mult: 1 });
      setModifier(1);
    });
  }

  function doUndo() {
    guard(() => onUndo());
  }

  return (
    <Wrap>
      <Grid cols={7} data-bust={bustFlash ? "true" : undefined}>
        {numbers.map((n) => {
          const blocked = isDisabled?.(n, modifier) ?? false;
          return (
            <Key
              key={n}
              disabled={disabled || blocked}
              onClick={() => sendNumber(n)}
            >
              {n}
            </Key>
          );
        })}

        <Key
          data-variant="bull"
          disabled={disabled || (isBullDisabled?.(modifier) ?? false)}
          onClick={sendBull}
          title="Bull (25)"
        >
          <FaBullseye /> Bull
        </Key>
      </Grid>

      <ActionsRow>
        <Key
          data-variant="miss"
          disabled={disabled}
          onClick={miss}
          title="Miss"
        >
          <FaBan /> Miss
        </Key>

        <Key
          data-variant="double"
          disabled={disabled}
          onClick={() => toggleModifier(2)}
          aria-pressed={modifier === 2}
          title="Double modifier"
        >
          Double
        </Key>

        <Key
          data-variant="triple"
          disabled={disabled}
          onClick={() => toggleModifier(3)}
          aria-pressed={modifier === 3}
          title="Triple modifier"
        >
          Triple
        </Key>

        <Key data-variant="undo" onClick={doUndo} title="Undo">
          <FaUndo /> Undo
        </Key>
      </ActionsRow>
    </Wrap>
  );
}
