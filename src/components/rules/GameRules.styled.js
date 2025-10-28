import styled from "styled-components";

export const LangSwitch = styled.div`
  display: flex;
  gap: 8px;
  margin: 0 0 12px;
`;

export const LangBtn = styled.button`
  border: 0;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  transition: transform 0.06s ease-in-out, background 0.2s ease;
  &:active {
    transform: translateY(1px);
  }
  &[disabled] {
    opacity: 1;
    background: ${({ theme }) => theme.colors.accent};
    color: #0b1419;
  }
`;

export const Intro = styled.p`
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.accent}1a;
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  font-size: 15px;
  line-height: 1.4;
`;

export const Section = styled.section`
  margin: 0 0 12px;
  h4 {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    line-height: 1.5;
  }
  ul {
    margin: 6px 0 0 18px;
    padding: 0;
  }
  li + li {
    margin-top: 4px;
  }
`;
