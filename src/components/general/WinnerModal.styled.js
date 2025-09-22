import styled from "styled-components";

export const Sheet = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 100;
  pointer-events: none;
`;
export const Card = styled.div`
  width: min(560px, 92vw);
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  pointer-events: auto;
`;
export const Title = styled.h2`
  margin: 0 0 12px;
`;
export const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
