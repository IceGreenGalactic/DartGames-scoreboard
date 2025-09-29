import styled from "styled-components";

export const Wrap = styled.div`
  display: grid;
  gap: 4px;
`;

export const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
`;

export const Scroller = styled.div`
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
`;

export const ChipRow = styled.div`
  display: inline-flex;
  gap: 6px;
  padding-right: 2px;
`;

export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1;
  border-radius: 9999px;
  border: ${({ $active }) =>
    $active ? "2px solid #fff" : "1px solid rgba(255,255,255,.25)"};
  background: ${({ theme }) => theme.colors.panel};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  cursor: pointer;
  font-family: ${({ $font }) => $font};
`;

export const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: inline-block;
`;
