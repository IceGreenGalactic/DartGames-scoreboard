import styled from "styled-components";

export const Wrap = styled.div`
  display: grid;
  gap: 10px;
`;

export const HeaderButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;

  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.12);
  color: inherit;
  text-align: left;

  &:active {
    transform: translateY(1px);
  }
`;

export const HeaderLeft = styled.div`
  display: grid;
  gap: 2px;
`;

export const HeaderTitle = styled.div`
  font-weight: 700;
`;

export const HeaderMeta = styled.div`
  font-size: 12px;
  opacity: 0.75;
`;

export const Body = styled.div`
  display: grid;
  gap: 14px;

  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.08);
`;

export const Row = styled.div`
  display: grid;
  gap: 8px;
`;

export const LabelRow = styled.label`
  display: flex;
  gap: 10px;
  align-items: center;
  user-select: none;

  input[type="checkbox"] {
    transform: translateY(1px);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.15);
  color: inherit;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
  justify-content: center;
  .btn {
    min-width: 170px;
  }
`;

export const Hint = styled.div`
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.85;
`;

export const SmallHint = styled.div`
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
`;

export const Pill = styled.span`
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  opacity: 0.9;

  &[data-on="1"] {
    opacity: 1;
  }
`;
