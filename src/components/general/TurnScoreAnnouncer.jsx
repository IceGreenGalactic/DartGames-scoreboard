import { useEffect, useRef } from "react";
import { useGameStore } from "../../store";
import { speak } from "../../store/lib/sfx";

export default function TurnScoreAnnouncer({
  enabledGames = ["501", "301"],
  minScore = 1,
  extraLockMs = 150,
} = {}) {
  const startedAtRef = useRef(Date.now());
  const lastEventKeyRef = useRef("");

  useEffect(() => {
    const unsub = useGameStore.subscribe(
      (next) => {
        const { gameType, runtime: rt, status } = next;

        if (!rt?.events?.length) return;
        if (!enabledGames.includes(gameType)) return;
        if (status !== "in_progress" && status !== "win_pending") return;

        const ev = rt.events[rt.events.length - 1];
        if (!ev || ev.type !== "turnEnd") return;
        if ((ev.at || 0) < startedAtRef.current) return;

        const key = `${ev.type}|${ev.at}|${ev.playerId}|${ev.turnScore}`;
        if (key === lastEventKeyRef.current) return;
        lastEventKeyRef.current = key;

        const score = Number(ev.turnScore);
        if (!Number.isFinite(score) || score < minScore) {
          lastEventKeyRef.current = key;
          return;
        }

        lastEventKeyRef.current = key;

        const duration = speak(score);
        useGameStore
          .getState()
          .setInputLockUntil(Date.now() + duration + extraLockMs);
      },
      (s) => ({ gameType: s.gameType, runtime: s.runtime, status: s.status }),
    );

    return () => unsub();
  }, [enabledGames, minScore, extraLockMs]);

  return null;
}
