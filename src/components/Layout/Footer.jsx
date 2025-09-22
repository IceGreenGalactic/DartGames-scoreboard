import { Wrap } from "./Layout.styled";

export function Footer() {
  return <Wrap>© {new Date().getFullYear()} DartGames</Wrap>;
}
