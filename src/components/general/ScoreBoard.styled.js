import styled, { keyframes } from "styled-components";
import { rgba, bonusCardPulse, bonusBadgeStyles } from "../../styles/general";

const dangerBlink = keyframes`
  0%,100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

export const Board = styled.div`
  margin-top: 12px;
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  @media (orientation: landscape) and (max-height: 520px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 8px;
    overflow-anchor: none;
  }
`;

export const Card = styled.div`
  position: relative;
  padding: 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid rgba(255, 255, 255, 0.06);
  scroll-snap-align: start;
  scroll-margin-bottom: 200px;
  container-type: inline-size;

  &[data-active="true"]:not([data-placed="true"]) {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 12px ${({ theme }) => rgba(theme.colors.accent, 0.35)};
  }

  &[data-placed="true"] {
    outline: none;
    box-shadow: inset 0 0 40px ${({ theme }) => rgba(theme.colors.accent, 0.35)};
  }

  &[data-bonus="true"] {
    ${({ theme }) => bonusCardPulse(theme.colors.accent)}
  }

  &[data-state="dead"] {
    opacity: 0.5;
    filter: grayscale(0.15) saturate(0.75);
  }

  &[data-state="killer"] [data-role="progress"] {
    color: ${({ theme }) => theme.colors.danger};
    font-weight: 800;
    letter-spacing: 0.2px;
  }

  &[data-state="warning"] [data-role="progress"] {
    color: ${({ theme }) => theme.colors.danger};
    font-weight: 700;
    animation: ${dangerBlink} 1s ease-in-out infinite;
  }

  [data-role="progress"] {
    margin-top: 6px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
  }

  [data-role="kills"] {
    margin-top: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  @media (orientation: landscape) and (max-height: 520px) {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto auto auto;
    gap: 8px;
    padding: 8px 10px;
    scroll-snap-align: none;
    scroll-margin-bottom: 0;
  }
`;

export const Score = styled.div`
  font-size: 42px;
  line-height: 1;
  font-weight: 800;

  @media (max-width: 900px) {
    font-size: 28px;
    line-height: 0.9;
  }
  @media (max-width: 700px) {
    font-size: 20px;
    line-height: 0.9;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    font-size: 28px;
    grid-column: 2;
    grid-row: 1;
    justify-self: center;
    align-self: start;
  }
`;

export const Name = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.muted};

  @media (orientation: landscape) and (max-height: 520px) {
    margin-top: 0;
    font-size: 14px;
    grid-column: 1;
    grid-row: 1;
    align-self: start;
  }
`;

export const Boxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 10px;

  @media (max-width: 430px) and (orientation: portrait) {
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    justify-items: center;

    & > *:nth-child(3) {
      grid-column: 1 / -1;
      justify-self: center;
      width: 70%;
    }

    & > * {
      width: 90%;
      font-size: 13px;
      padding: 6px 4px;
      min-height: 28px;
    }
  }

  @media (orientation: landscape) and (max-height: 520px) {
    grid-column: 1 / -1;
    grid-row: 3;
    margin: 0;
    width: 100%;
    gap: 6px;
    justify-self: stretch;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Box = styled.div`
  text-align: center;
  padding: 8px 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  min-height: 36px;
  display: grid;
  place-items: center;
  white-space: nowrap;
  font-size: clamp(12px, 3.2vw, 14px);
  line-height: 1;

  &[data-throw="bull"] {
    font-size: clamp(11px, 2.8vw, 13px);
    letter-spacing: 0.2px;
    padding-inline: 4px;
  }

  @media (max-width: 900px) {
    min-height: 26px;
    padding: 4px 4px;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    min-height: 24px;
    font-size: 12px;
    padding: 4px 6px;

    &[data-throw="bull"] {
      font-size: 11px;
      padding-inline: 4px;
    }
  }
`;

export const RoundSum = styled.div`
  margin-top: 8px;
  min-height: 18px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;

  @media (max-width: 900px) {
    min-height: 16px;
    font-size: 12px;
    margin-top: 2px;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-self: start;
    margin: 0;
    font-size: 12px;
    min-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Badge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  background: ${({ theme }) => theme.colors.accent};
  color: #0b1419;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;

  &[data-type="bonus"] {
    ${({ theme }) => bonusBadgeStyles(theme.colors.accent)}
    font-size: 11px;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    position: static;
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
    font-size: 11px;
    padding: 3px 8px;
  }
`;
