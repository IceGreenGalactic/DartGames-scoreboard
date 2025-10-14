import styled from "styled-components";

export const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;

export const Title = styled.h1`
  margin: 0;
`;

export const Lead = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  .muted {
    color: ${({ theme }) => theme.colors.muted};
    border: 1px solid ${({ theme }) => theme.colors.muted};
  }
`;

export const Stat = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 4px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;
