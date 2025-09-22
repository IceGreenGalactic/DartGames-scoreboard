import styled from "styled-components";

export const Shell = styled.div`
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

export const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.panel};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const HeaderInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LogoImg = styled.img`
  height: 28px;
  width: auto;
  display: block;
`;

export const Brand = styled.div`
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-right: auto;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 10px;
  a {
    padding: 6px 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
  }
  a.active {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
  }
`;

export const Main = styled.main`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(6)};
`;

export const Wrap = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: ${({ theme }) => theme.colors.panel};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;
