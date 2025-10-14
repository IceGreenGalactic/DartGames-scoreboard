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
  #root { min-height: 100dvh; }

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

  @media (hover: none) and (pointer: coarse) {
    body { background-attachment: scroll; }
  }

  @media (orientation: portrait) {
    body {
      background: ${({ theme }) =>
        theme.bgImageMobile
          ? `${theme.colors.bg} url(${theme.bgImageMobile}) center/cover no-repeat`
          : undefined};
      background-position: center top;
    }
  }

  @media (max-aspect-ratio: 3/4) {
    body {
    }
  }

  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  button { cursor: pointer; }
`;
