import styled from "styled-components";

export const LangSwitch = styled.div`
  display: flex;
  gap: 8px;
  margin: 0 0 8px;
`;

export const LangBtn = styled.button`
  border: 0;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  &[disabled] {
    opacity: 1;
    background: ${({ theme }) => theme.colors.accent};
    color: #0b1419;
  }
`;

export const Intro = styled.p`
  margin: 0 0 8px;
`;

export const Section = styled.section`
  margin: 0 0 10px;
  h4 {
    margin: 0 0 4px;
    font-size: 14px;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }
  ul {
    margin: 4px 0 0 18px;
  }
`;
