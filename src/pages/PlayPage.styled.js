import styled from "styled-components";

export const Title = styled.div`
  display: grid;
  gap: 6px;
  margin: 0 0 12px;
  h1 {
    margin: 0;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const ResultsCard = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
    background: rgba(255, 255, 255, 0.04);
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

export const HintArea = styled.div`
  margin: 8px 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 36px;

  @media (max-width: 600px) {
    min-height: 28px;
    margin: 6px 0 2px;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    min-height: 24px;
    margin: 4px 0 0;
  }
`;

export const HintBar = styled.div`
  display: flex;
  gap: 8px;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 2px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    gap: 6px;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    gap: 4px;
  }
`;

export const HintSteps = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(61, 220, 151, 0.12);
  border: 1px solid rgba(61, 220, 151, 0.35);
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 3px 8px;
    gap: 4px;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    font-size: 11px;
    padding: 2px 6px;
    gap: 4px;
  }
`;

export const DoubleOutSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 16px 0 8px;
  opacity: 0.9;

  .form-check-input {
    cursor: pointer;
    width: 2.6em;
    height: 1.4em;
  }

  .form-check-label {
    font-weight: 600;
    user-select: none;
    color: ${({ theme }) => theme.colors.text};
  }
`;
