import styled from "styled-components";

export const Btn = styled.button`
  border: 0;
  background:transparent;
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  padding: 6px 10px;
  font-weight: 700;
`;

export const Sheet = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  z-index: 100;
  > div {
    width: min(680px, 92vw);
    background: ${({ theme }) => theme.colors.panel};
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px 50px;
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.accent};
    font-weight: 600;
    text-decoration: underline;
  }
`;

export const Close = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  padding: 6px 8px;
`;

export const Body = styled.div`
  color: ${({ theme }) => theme.colors.text};
  p {
    margin: 0 0 8px;
  }
  ul {
    margin: 0 0 8px 16px;
  }
`;
