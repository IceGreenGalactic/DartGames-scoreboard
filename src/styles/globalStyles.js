import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    --kb-h: 180px;
  }
  @media (orientation: landscape) and (max-height: 520px) {
    :root { --kb-h: 120px; }
  }

  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  button { cursor: pointer; }
`;
