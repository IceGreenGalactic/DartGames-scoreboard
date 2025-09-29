import { NavLink } from "react-router-dom";
import { Bar, HeaderInner, Brand, Nav } from "./Layout.styled";
import { StatsButton } from "../general/StatsButton";

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
          <StatsButton />
        </Nav>
      </HeaderInner>
    </Bar>
  );
}
