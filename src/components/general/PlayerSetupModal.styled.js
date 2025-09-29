import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 100;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
`;

export const Title = styled.h2`
  margin: 0 0 12px;
`;

export const Section = styled.div`
  margin: 12px 0 16px;
  label {
    display: block;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
`;

export const Input = styled.input`
  width: 100%;
  margin-bottom: 8px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const Pills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Pill = styled.button`
  border: 0;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }
`;

export const Small = styled.div`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
`;

export const ToggleInput = styled.input``;

export const ToggleLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

//killer
export const PlayerRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
`;

export const PlayerName = styled.span`
  min-width: 80px;
`;
