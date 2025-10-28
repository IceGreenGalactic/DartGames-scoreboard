import styled from "styled-components";

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
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  @media (orientation: landscape) and (max-height: 520px) {
    grid-template-columns: 1fr;
    gap: 8px;
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

  &[data-active="true"] {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }
  &[data-winner="true"] {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 4px rgba(61, 220, 151, 0.2) inset;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
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
  }
`;

export const Name = styled.div`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.muted};

  @media (orientation: landscape) and (max-height: 520px) {
    margin-top: 0;
    font-size: 14px;
  }
`;

export const Boxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 10px;

  @media (max-width: 900px) {
    font-size: 12px;
    margin-top: 3px;
  }

  @media (orientation: landscape) and (max-height: 520px) {
    margin: 0;
    justify-self: end;
    width: 160px;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
`;

export const Box = styled.div`
  text-align: center;
  padding: 8px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  min-height: 36px;
  display: grid;
  place-items: center;

  @media (max-width: 900px) {
    min-height: 26px;
    padding: 4px 2px;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    min-height: 24px;
    font-size: 12px;
    padding: 4px 6px;
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
    justify-self: start;
    margin: 0;
    font-size: 12px;
     min-height: 18px;
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

  @media (orientation: landscape) and (max-height: 520px) {
    position: static;
    justify-self: end;
    font-size: 11px;
    padding: 3px 8px;
  }
`;
