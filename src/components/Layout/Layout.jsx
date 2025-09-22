import { Header } from "./Header";
import { Footer } from "./Footer";
import { Shell, Main } from "./Layout.styled";

export function Layout({ children }) {
  return (
    <Shell>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Shell>
  );
}
