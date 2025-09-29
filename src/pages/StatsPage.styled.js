import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 16px;
  max-width: 1000px;
  margin: 0 auto;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0 24px 0;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StatBox = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border-radius: ${({ theme }) => theme.radii?.lg || "12px"};
  padding: 12px;
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
`;

export const StatLabel = styled.div`
  opacity: 0.8;
  font-size: 12px;
`;

export const Section = styled.section`
  margin-top: 24px;
`;

export const H2 = styled.h2`
  margin: 0 0 8px 0;
`;

export const H3 = styled.h3`
  margin: 0 0 12px 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii?.lg || "12px"};
  overflow: hidden;
`;

export const THead = styled.thead`
  background: rgba(255, 255, 255, 0.04);
`;

export const TBody = styled.tbody``;

export const Tr = styled.tr`
  &:not(:last-child) td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 10px 12px;
`;
