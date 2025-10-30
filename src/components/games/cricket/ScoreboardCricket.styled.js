import styled from "styled-components";
import {
  Board as BaseBoard,
  Cards as BaseCards,
  Card as BaseCard,
} from "../../general/ScoreBoard.styled";
import { Boxes } from "../../general/ScoreBoard.styled";
import { FaSlash, FaTimes } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";

export const CricketBoard = styled(BaseBoard)`
  @media (orientation: landscape) and (max-height: 520px) {
    padding: 6px 4px;
  }
`;
export const CricketCards = styled(BaseCards)`
  @media (orientation: landscape) and (max-height: 520px) {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    overflow-anchor: none;
  }
`;

export const CricketCard = styled(BaseCard)`
  @media (orientation: landscape) and (max-height: 520px) {
    flex: 0 0 calc((100% - 12px) / 3);
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    > * {
      grid-column: 1 / -1;
    }
    gap: 4px;
    padding: 6px 6px;
  }
`;
export const MarksGrid = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 6px;

  @media (orientation: landscape) and (max-height: 520px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px 8px;
    margin-top: 0px;
  }
`;

export const MarkRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 8px;
  align-items: center;
  font-size: 14px;

  @media (orientation: landscape) and (max-height: 520px) {
    grid-template-columns: 28px 1fr;
    gap: 4px;
    font-size: 12px;
  }
`;

export const MarkKey = styled.div`
  opacity: 0.7;
  text-align: right;
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

  @media (orientation: landscape) and (max-height: 520px) {
    border-radius: 6px;
    padding: 4px 6px;
    min-height: 20px;
  }
`;

export const ThrowsBoxes = styled(Boxes)`
  margin-top: 10px;

  @media (orientation: landscape) and (max-height: 520px) {
    margin-top: 4px;
    justify-self: center;
    width: 140px;
    gap: 6px;
  }
`;

export const SlashIcon = styled(FaSlash)`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.05em;
  line-height: 1;

  @media (orientation: landscape) and (max-height: 520px) {
    font-size: 0.98em;
  }
`;

export const TimesIcon = styled(FaTimes)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 1.1em;
  line-height: 1;

  @media (orientation: landscape) and (max-height: 520px) {
    font-size: 1.02em;
  }
`;

export const CloseIcon = styled(CgCloseO)`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1.1em;
  line-height: 1;

  @media (orientation: landscape) and (max-height: 520px) {
    font-size: 1.02em;
  }
`;
