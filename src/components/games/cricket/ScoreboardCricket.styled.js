import styled from "styled-components";
import { Boxes } from "../../general/ScoreBoard.styled";
import { FaSlash, FaTimes } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";

export const MarksGrid = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 6px;
`;

export const MarkRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 8px;
  align-items: center;
  font-size: 14px;
`;

export const MarkKey = styled.div`
  opacity: 0.7;
`;

export const MarkCell = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 6px 8px;
  text-align: center;
  font-weight: 700;
  min-height: 28px;
  display: grid;
  place-items: center;
`;

export const ThrowsBoxes = styled(Boxes)`
  margin-top: 10px;
`;

export const SlashIcon = styled(FaSlash)`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.05em;
  line-height: 1;
`;

export const TimesIcon = styled(FaTimes)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 1.1em;
  line-height: 1;
`;

export const CloseIcon = styled(CgCloseO)`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.1em;
  line-height: 1;
`;
