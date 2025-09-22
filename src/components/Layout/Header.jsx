import { NavLink } from "react-router-dom";
import { Bar, HeaderInner, Brand, Nav, LogoImg } from "./Layout.styled";
// import Logo from "../../assets/images/DartGames-logo.png";

export function Header() {
  return (
    <Bar>
      <HeaderInner>
        {/* <LogoImg src={Logo} alt="DartGames logo" /> */}
        <Brand>DartGames</Brand>
        <Nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/setup">Setup</NavLink>
        </Nav>
      </HeaderInner>
    </Bar>
  );
}
