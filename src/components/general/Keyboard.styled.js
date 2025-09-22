import styled, { keyframes } from "styled-components";

const bustFlash = keyframes`
  0%   { box-shadow: 0 0 0 6px rgba(241, 87, 87, 0.6); }
  20%  { 
    box-shadow: 0 0 0 6px rgba(201, 39, 39, 0.6); 
    background: rgba(211, 47, 47, 0.24);
  }
  50%  { background: rgba(211,47,47,0.0); }
  60%  { box-shadow: 0 0 0 0 rgba(211,47,47,0.0); }
  100% { 
    box-shadow: 0 0 0 0 rgba(211,47,47,0.0);
    background: rgba(211,47,47,0.0);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, minmax(0, 1fr))`};
  gap: 8px;
  margin-top: 16px;
  position: relative;

  &[data-bust="true"] {
    animation: ${bustFlash} 5s ease;
  }
`;

export const Key = styled.button`
  padding: 12px 10px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  transition: background 0.15s ease, transform 0.05s ease, filter 0.15s ease,
    box-shadow 0.15s ease;

  &[aria-pressed="true"] {
    transform: translateY(1px);
    filter: brightness(0.92);
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.accent};
  }

  &:hover {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
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
`;
