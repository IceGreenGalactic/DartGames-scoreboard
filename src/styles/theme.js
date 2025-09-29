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
    name: "Bubblegum",
    colors: {
      bg: "#2a1a22",
      panel: "rgba(58, 34, 48, 0.92)",
      accent: "#ff5fa2",
      danger: "#ff6b6b",
      text: "#c10679ff",
      muted: "#d0548bff",
    },
    bgImage: "/src/assets/images/bubblegum.png",
    fontFamily:
      "'Lilita One', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
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
    bgImage: "/src/assets/images/disney.png",
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
    bgImage: "/src/assets/images/nebula.png",
    fontFamily:
      "'Orbitron', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "8px" },
    spacing: space,
  },

  green: {
    name: "Pitch",
    colors: {
      bg: "#0f1612",
      panel: "rgba(24, 36, 28, 0.92)",
      accent: "#32cd32",
      danger: "#e63946",
      text: "#e7f5e7",
      muted: "#a3b6a3",
    },
    bgImage: "/src/assets/images/pitch.png",
    fontFamily:
      "'Rajdhani', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "12px" },
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
    bgImage: "/src/assets/images/glacier.png",
    fontFamily:
      "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
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
    bgImage: "/src/assets/images/luxe.png",
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
    bgImage: "/src/assets/images/saloon.png",
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
    bgImage: "/src/assets/images/bullseye.png",
    fontFamily:
      "'Oswald', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    radii: { lg: "4px" },
    spacing: space,
  },
};
