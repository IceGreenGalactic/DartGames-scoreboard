import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Mouse+Memoirs&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&display=swap');

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
    background: ${({ theme }) =>
      theme.bgImage
        ? `${theme.colors.bg} url(${theme.bgImage}) center/cover no-repeat fixed`
        : theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) =>
      theme.fontFamily ||
      "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"};
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  button { cursor: pointer; }
`;
