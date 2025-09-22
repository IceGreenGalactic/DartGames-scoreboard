import styled from "styled-components";

export const Title = styled.div`
  display: grid;
  gap: 6px;
  margin: 0 0 12px;
  h1 { margin: 0; }
  p { margin: 0; color: ${({ theme }) => theme.colors.muted}; }
`;

export const ResultsCard = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
`;

export const ResultsHeader = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
`;

export const ResultsList = styled.ol`
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 6px;

  li {
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
  }
`;

export const ResultMeta = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

export const ResultsActions = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
