import styled from "styled-components";

export const Board = styled.div`
  margin-top: 12px;
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
`;

export const Card = styled.div`
  position: relative;
  padding: 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid rgba(255, 255, 255, 0.06);
  &[data-active="true"] {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }
  &[data-winner="true"] {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 4px rgba(61, 220, 151, 0.2) inset;
  }
`;

export const Score = styled.div`
  font-size: 42px;
  line-height: 1;
  font-weight: 800;
`;

export const Name = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Boxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 10px;
`;

export const Box = styled.div`
  text-align: center;
  padding: 8px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  min-height: 36px;
  display: grid;
  place-items: center;
`;

export const RoundSum = styled.div`
  margin-top: 8px;
  min-height: 18px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
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
`;
