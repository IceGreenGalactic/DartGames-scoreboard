import { NavLink } from "react-router-dom";
import { Bar, HeaderInner, Brand, Nav } from "./Layout.styled";

export function Header() {
  return (
    <Bar>
      <HeaderInner>
        <Brand>DartGames</Brand>
        <Nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/setup">Setup</NavLink>
          <NavLink to="/stats">Stats</NavLink>
        </Nav>
      </HeaderInner>
    </Bar>
  );
}
