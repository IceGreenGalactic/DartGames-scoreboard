import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/globalStyles";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGameStore } from "./store";
import { themes } from "./styles/theme";

function Root() {
  const t = useGameStore((s) => s.theme);
  const theme = themes[t] || themes.auto;
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
