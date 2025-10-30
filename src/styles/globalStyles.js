import { createGlobalStyle, css } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root { color-scheme: dark; --kb-h: 180px; }
  @media (orientation: landscape) and (max-height: 520px) {
    :root { --kb-h: 120px; }
  }

  * { box-sizing: border-box; }
  html, body, #root { height: 100%; overflow-x: hidden; }
  #root { min-height: 100dvh; }

  body {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) =>
      theme.fontFamily ||
      "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"};
    background-color: ${({ theme }) => theme.colors.bg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ${({ theme }) =>
    theme.bgImage &&
    css`
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background-image: linear-gradient(
            rgba(0, 0, 0, 0.18),
            rgba(0, 0, 0, 0.18)
          ),
          url(${theme.bgImage});
        background-position: center top, center top;
        background-size: 100% 100%, cover;
        background-repeat: no-repeat, no-repeat;
      }
    `}

  @media (orientation: portrait) {
    ${({ theme }) =>
      (theme.bgImageMobile || theme.bgImage) &&
      css`
        body::before {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.18),
              rgba(0, 0, 0, 0.18)
            ),
            url(${theme.bgImageMobile || theme.bgImage});
          background-size: 100% 100%, cover;
        }
      `}
  }

  button, input {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background: none;
    border: none;
    outline: none;
  }

  @media (hover: hover) and (pointer: fine) {
  button, a { cursor: pointer; }
}
  img, video { max-width: 100%; height: auto; display: block; }

  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }

  
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;
