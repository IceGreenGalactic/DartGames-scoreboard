import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, minmax(0, 1fr))`};
  gap: 8px;
  margin-top: 16px;
`;

export const Key = styled.button`
  padding: 12px 10px;
  border-radius: 12px;
  border: 0;
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  transition: background 0.2s, transform 0.1s;

  &[aria-pressed="true"] {
    transform: translateY(3px);
    filter: brightness(0.95);
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
    background: #088951ff;
    color: #0b1419;
  }
`;
