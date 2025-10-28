import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    if (!title) return;

    const finalTitle =
      title === "clock"
        ? "DartGames • Around the Clock"
        : `DartGames • ${title?.toUpperCase?.() ?? title}`;

    const prev = document.title;
    document.title = finalTitle;

    return () => {
      document.title = prev;
    };
  }, [title]);
}
