import styled, { keyframes } from "styled-components";

const bustGlow = keyframes`
  0%   { box-shadow: 0 0 0 0 var(--bustA); background: transparent; }
  30%  { box-shadow: 0 0 22px 2px var(--bustA), 0 0 40px 6px var(--bustB); background: var(--bustC); }
  100% { box-shadow: 0 0 0 0 transparent; background: transparent; }
`;

const bustShake = keyframes`
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
`;

export const Wrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 680px;
  margin: clamp(8px, 2.5vh, 16px) auto clamp(12px, 3.5vh, 28px);
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii?.lg || "16px"};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 4px
      color-mix(in srgb, ${({ theme }) => theme.colors.accent} 26%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);

  --bustA: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent} 8%,
    transparent
  );
  --bustB: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent} 14%,
    transparent
  );
  --bustC: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.danger} 8%,
    transparent
  );

  > * + * {
    margin-top: 10px;
  }

  @media (max-width: 560px) {
    max-width: 100%;
    padding: 10px;
    border-radius: calc((${({ theme }) => theme.radii?.lg || "16px"}) - 4px);
    > * + * {
      margin-top: 8px;
    }
  }

  @media (min-width: 900px) {
    margin: 24px auto 40px;
    padding: 14px 16px;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    padding: 8px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, minmax(0, 1fr))`};
  gap: 8px;
  position: relative;

  &[data-bust="true"] {
    animation: ${bustGlow} 2.5s ease, ${bustShake} 0.48s ease-in-out 1;
    border-radius: 12px;
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 6px;
  }
  &[data-bust="true"] button {
    pointer-events: none;
    opacity: 0.7;
  }
`;

export const ActionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 560px) {
    gap: 6px;
  }
`;

export const Key = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  font-size: clamp(13px, 2.8vw, 16px);
  line-height: 1;
  min-height: 42px;
  transition: background 0.15s ease, transform 0.06s ease, filter 0.15s ease,
    box-shadow 0.12s ease;

  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 1px 0 rgba(0, 0, 0, 0.35), 0 6px 14px rgba(0, 0, 0, 0.28);

  svg {
    width: 0.95em;
    height: 0.95em;
  }

  &[aria-pressed="true"] {
    transform: translateY(1px);
    filter: brightness(0.96);
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.accent},
      0 1px 20px rgba(182, 148, 148, 1);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 1px;
    }
  }

  &:active {
    transform: translateY(2px);
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.06),
      0 0 0 rgba(0, 0, 0, 0);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &[data-variant="double"] {
    background: #ffd400;
    color: #000;
  }
  &[data-variant="triple"] {
    background: #ff8a00;
    color: #000;
  }
  &[data-variant="undo"] {
    background: #d32f2f;
    color: #fff;
  }
  &[data-variant="miss"] {
    background: #000;
    color: #fff;
  }
  &[data-variant="bull"] {
    background: #088951;
    color: #0b1419;
  }

  @media (max-width: 560px) {
    padding: 9px 10px;
    border-radius: 10px;
    min-height: 40px;
    font-size: 14px;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    padding: 7px 8px;
    border-radius: 10px;
    min-height: 34px;
    font-size: 12px;
  }

  @media (orientation: landscape) and (max-height: 420px) {
    padding: 6px 7px;
    border-radius: 8px;
    min-height: 30px;
    font-size: 11px;
  }
`;
