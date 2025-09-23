import styled from "styled-components";

export const Title = styled.h1`
  margin: 0 0 8px;
`;

export const Lead = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.muted};
`;

//pageLayout
export const PageWrap = styled.div`
  display: grid;
  gap: 16px;
`;

export const StepsRow = styled.div`
  display: grid;
  gap: 16px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

export const Step = styled.section`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const StepBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: #0b1419;
  display: grid;
  place-items: center;
  font-weight: 800;
`;

export const StepTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

export const StepSub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

export const StepBody = styled.div`
  display: grid;
  gap: 12px;
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 8px 0;
`;

//players

export const SelectedList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 38px;
  align-items: center;
`;

export const SelectedChip = styled.button`
  border: 0;
  padding: 8px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: #0b1419;
  font-weight: 700;
`;

export const RecentWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const RecentChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: inherit;
  font-weight: 600;

  &[data-active="true"] {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }

  .name { pointer-events: none; }

  .actions {
    display: inline-flex;
    gap: 4px;
  }

  .iconbtn {
    border: 0;
    background: rgba(255,255,255,0.08);
    color: inherit;
    border-radius: 8px;
    padding: 4px 6px;
    line-height: 1;
  }
  .iconbtn.ok { background: #1bb76e; color: #0b1419; }
  .iconbtn.danger { background: #d32f2f; color: #fff; }

  .chip-input {
    border: 0;
    outline: none;
    background: rgba(255,255,255,0.1);
    color: inherit;
    border-radius: 8px;
    padding: 4px 8px;
    min-width: 120px;
  }
`;

export const AddRow = styled.div`
  display: flex;
  gap: 8px;

  input {
    background: ${({ theme }) => theme.colors.muted};
  }
`;

export const Games = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`;

export const GameBtn = styled.button`
  border: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  text-align: left;
  &:hover {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }
`;

