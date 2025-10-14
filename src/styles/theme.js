import glacier from "../assets/images/glacier.png";
import luxe from "../assets/images/Luxe.png";
import nebula from "../assets/images/nebula.png";
import saloon from "../assets/images/saloon.png";
import disney from "../assets/images/disney.png";
import neonPink from "../assets/images/neonpink.png";
import pulse from "../assets/images/pulse.png";
import inferno from "../assets/images/inferno.png";
import bullseye from "../assets/images/bullseye.png";

const space = (n) => `${4 * n}px`;

export const themes = {
  auto: {
    name: "Auto",
    colors: {
      bg: "#0f1115",
      panel: "#242535",
      accent: "#3ddc97",
      danger: "#ff5c5c",
      text: "#e9edf1",
      muted: "#9aa5b1",
    },
    radii: { lg: "16px" },
    spacing: space,
  },

  pink: {
    name: "Neon Pink",
    colors: {
      bg: "#140017",
      panel: "rgba(45, 0, 58, 0.9)",
      accent: "#ff4fa3",
      danger: "#ff2d55",
      text: "#ffe6f7",
      muted: "#d88bbd",
    },
    bgImage: neonPink,
    fontFamily:
      "'Audiowide', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "18px" },
    spacing: space,
  },

  disney: {
    name: "Disney",
    colors: {
      bg: "#0d1024",
      panel: "rgba(23, 26, 58, 0.92)",
      accent: "#4cc9f0",
      danger: "#ff4d6d",
      text: "#e8f0ff",
      muted: "#aab6ff",
    },
    bgImage: disney,
    fontFamily:
      "'Mouse Memoirs', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "20px" },
    spacing: space,
  },

  purple: {
    name: "Nebula",
    colors: {
      bg: "#1b1528",
      panel: "rgba(43, 33, 66, 0.9)",
      accent: "#9d7dff",
      danger: "#ef476f",
      text: "#efe9ff",
      muted: "#b8a7d9",
    },
    bgImage: nebula,
    fontFamily:
      "'Oxanium', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "8px" },
    spacing: space,
  },

  pulse: {
    name: "Pulse",
    colors: {
      bg: "#081018",
      panel: "rgba(10, 24, 36, 0.9)",
      accent: "#20f0ff",
      danger: "#ff4d6d",
      text: "#dff6ff",
      muted: "#8bb6c9",
    },
    bgImage: pulse,
    fontFamily:
      "'Exo 2', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "12px" },
    spacing: space,
  },

  inferno: {
    name: "Inferno",
    colors: {
      bg: "#180b0a",
      panel: "rgba(42, 16, 12, 0.9)",
      accent: "#ff7a1a",
      danger: "#ff3b30",
      text: "#ffe8d9",
      muted: "#e2b39a",
    },
    bgImage: inferno,
    fontFamily:
      "'Almendra SC', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "14px" },
    spacing: space,
  },

  blue: {
    name: "Glacier",
    colors: {
      bg: "#0a1016",
      panel: "rgba(15, 28, 44, 0.8)",
      accent: "#3ea6ff",
      danger: "#ff5c5c",
      text: "#e6f7ff",
      muted: "#9ec0d9",
    },
    bgImage: glacier,
    fontFamily:
      "'Jura', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "14px" },
    spacing: space,
  },

  gold: {
    name: "Luxe",
    colors: {
      bg: "#1f1a0b",
      panel: "rgba(42, 35, 14, 0.9)",
      accent: "#ffcc4d",
      danger: "#ff6b35",
      text: "#fff3c4",
      muted: "#d9c68a",
    },
    bgImage: luxe,
    fontFamily:
      "'Cinzel', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "16px" },
    spacing: space,
  },

  brown: {
    name: "Saloon",
    colors: {
      bg: "#2b2118",
      panel: "rgba(58, 46, 34, 0.92)",
      accent: "#c48a3a",
      danger: "#e76f51",
      text: "#f5e6d3",
      muted: "#d5c1a6",
    },
    bgImage: saloon,
    fontFamily: "'Rye', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "10px" },
    spacing: space,
  },

  dartClassic: {
    name: "Bullseye",
    colors: {
      bg: "#111313",
      panel: "rgba(0, 0, 0, 0.65)",
      accent: "#13a046",
      danger: "#d93030",
      text: "#f1f5f9",
      muted: "#b8c2cc",
    },
    bgImage: bullseye,
    fontFamily:
      "'Oswald', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "4px" },
    spacing: space,
  },
};
