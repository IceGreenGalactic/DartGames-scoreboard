import { useGameStore } from "../../store";
import { themes } from "../../styles/theme";
import {
  Wrap,
  Label,
  Scroller,
  ChipRow,
  Chip,
  Dot,
} from "./ThemePicker.styled";

const ORDER = [
  "auto",
  "pink",
  "disney",
  "purple",
  "green",
  "blue",
  "gold",
  "brown",
  "dartClassic",
];
const FALLBACK_FONT = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

export function ThemePicker() {
  const current = useGameStore((s) => s.theme);
  const setTheme = useGameStore((s) => s.setTheme);
  const keys = ORDER.filter((k) => themes[k]);

  return (
    <Wrap>
      <Label>Velg tema</Label>
      <Scroller>
        <ChipRow>
          {keys.map((k) => {
            const t = themes[k];
            const font = t.fontFamily || FALLBACK_FONT;
            const color = t.colors?.accent || "#888";
            const label = t.name || k;
            return (
              <Chip
                key={k}
                onClick={() => setTheme(k)}
                $active={current === k}
                $font={font}
                aria-label={label}
                title={label}
                style={{ color }}
              >
                <Dot $color={color} />
                {label}
              </Chip>
            );
          })}
        </ChipRow>
      </Scroller>
    </Wrap>
  );
}
