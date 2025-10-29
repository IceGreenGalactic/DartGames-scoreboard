import { keyframes, css } from "styled-components";

// --- Color utils ---
export const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const bigint = parseInt(full, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

export const rgba = (hex, a) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const lighten = (hex, amount = 0.2) => {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr}, ${lg}, ${lb})`;
};

// --- Keyframes ---
export const pulse = keyframes`
  0% { transform: scale(0.98); box-shadow: 0 0 0 0 var(--pulseA); }
  50% { transform: scale(1.00); box-shadow: 0 0 0 8px var(--pulseB); }
  100% { transform: scale(0.98); box-shadow: 0 0 0 0 var(--pulseA); }
`;

export const pop = keyframes`
  0% { transform: translateY(-8px) scale(0.96); opacity: 0; }
  40% { transform: translateY(0) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
`;

export const pulseBadge = keyframes`
  0% { transform: scale(0.95); opacity: 0.9; }
  100% { transform: scale(1.05); opacity: 1; }
`;

// --- Reusable style snippets ---
export const bonusCardPulse = (accent) => css`
  --pulseA: ${rgba(accent, 0.4)};
  --pulseB: ${rgba(accent, 0.15)};
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export const bonusBadgeStyles = (accent) => css`
  background: linear-gradient(135deg, ${lighten(accent, 0.35)}, ${accent});
  color: #111;
  box-shadow: 0 6px 18px ${rgba(accent, 0.35)};
  border: 1px solid ${rgba(accent, 0.4)};
  animation: ${pulseBadge} 1s ease-in-out infinite alternate;
`;
