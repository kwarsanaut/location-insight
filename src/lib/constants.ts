// Sequential green palette (ColorBrewer YlGn inspired) — #1 = darkest, #10 = lightest
export const RANK_COLORS = [
  "#004d00", // 1  deep forest
  "#1a7a1a", // 2
  "#2d9e2d", // 3
  "#4db84d", // 4
  "#6fce6f", // 5
  "#93de93", // 6
  "#b3e8b3", // 7
  "#cef0ce", // 8
  "#e2f5e2", // 9
  "#f0faf0", // 10
] as const;

// Unranked polygon styling
export const UNRANKED_FILL = "#f0f0f0";
export const UNRANKED_BORDER = "#ccc";

export const MAP_CENTER: [number, number] = [-6.3, 106.83];
export const MAP_ZOOM = 11;

export const GTV_LEVELS = [
  { key: "low", label: "Low (70%)", pct: "70%" },
  { key: "mid", label: "Mid (85%)", pct: "85%" },
  { key: "high", label: "High (100%)", pct: "100%" },
  { key: "ambisius", label: "Ambisius (120%)", pct: "120%" },
] as const;

export const TOP_N = 10;
