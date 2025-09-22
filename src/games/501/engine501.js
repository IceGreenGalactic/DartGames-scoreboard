import { useState } from "react";

export function useEngine501() {
  const [throws, setThrows] = useState([]);
  const [score, setScore] = useState(501);

  function onThrow(t) {
    setThrows((prev) => {
      const next = [...prev];
      if (t.value == null) {
        const last = next.at(-1);
        if (last && last.value && last.mult === 1) {
          last.mult = t.mult === 2 ? 2 : t.mult === 3 ? 3 : 1;
        }
      } else {
        next.push({ value: t.value, mult: t.mult ?? 1 });
      }
      const total = next.reduce((s, d) => s + d.value * (d.mult || 1), 0);
      setScore(Math.max(0, 501 - total));
      return next;
    });
  }

  function onUndo() {
    setThrows((prev) => {
      const next = prev.slice(0, -1);
      const total = next.reduce((s, d) => s + d.value * (d.mult || 1), 0);
      setScore(Math.max(0, 501 - total));
      return next;
    });
  }

  return { throws, onThrow, onUndo, scoreView: { current: score, start: 501 } };
}
