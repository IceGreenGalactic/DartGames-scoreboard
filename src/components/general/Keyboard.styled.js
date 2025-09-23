import styled, { keyframes } from "styled-components";

const bustFlash = keyframes`
  0%   { box-shadow: 0 0 0 6px rgba(241, 87, 87, 0.6); }
  20%  { box-shadow: 0 0 0 6px rgba(201, 39, 39, 0.6); background: rgba(211, 47, 47, 0.24); }
  50%  { background: rgba(211,47,47,0.0); }
  60%  { box-shadow: 0 0 0 0 rgba(211,47,47,0.0); }
  100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.0); background: rgba(211,47,47,0.0); }
`;

export const Wrap = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 8px auto 0;
  padding: 0 8px;

  @media (max-width: 560px) {
    max-width: 100%;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, minmax(0, 1fr))`};
  gap: 8px;
  margin-top: 10px;
  position: relative;

  &[data-bust="true"] {
    animation: ${bustFlash} 5s ease;
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 6px;
  }
`;

export const ActionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 8px;

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
  font-size: clamp(12px, 1.9rem, 16px);
  line-height: 1;
  min-height: 40px;
  transition: background 0.15s ease, transform 0.05s ease, filter 0.15s ease, box-shadow 0.15s ease;

  svg { width: 0.95em; height: 0.95em; }

  &[aria-pressed="true"] {
    transform: translateY(1px);
    filter: brightness(0.92);
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.accent};
  }

  &:hover { outline: 2px solid ${({ theme }) => theme.colors.accent}; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }

  &[data-variant="double"] { background: #ffd400; color: #000; }
  &[data-variant="triple"] { background: #ff8a00; color: #000; }
  &[data-variant="undo"]   { background: #d32f2f; color: #fff; }
  &[data-variant="miss"]   { background: #000;    color: #fff; }
  &[data-variant="bull"]   { background: #088951; color: #0b1419; }

  @media (max-width: 560px) {
    padding: 8px 10px;
    border-radius: 10px;
    min-height: 34px;
    font-size: 13px;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    padding: 6px 8px;
    border-radius: 10px;
    min-height: 30px;
    font-size: 12px;
  }

  @media (orientation: landscape) and (max-height: 420px) {
    padding: 5px 7px;
    border-radius: 8px;
    min-height: 26px;
    font-size: 11px;
  }
`;
