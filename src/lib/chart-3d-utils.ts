// 3D Chart Utilities — color helpers, SVG bar extrusion paths, constants

/** Default 3D chart constants */
export const CHART_3D = {
  perspective: 800,       // px — default CSS perspective
  tiltX: 8,              // degrees — default X tilt for donuts/areas
  tiltY: -4,             // degrees — default Y tilt
  barDx: 6,              // px — bar extrusion X offset
  barDy: -6,             // px — bar extrusion Y offset (negative = up)
  heatmapTiltX: 6,       // degrees — lighter tilt for heatmaps
  ringPerspective: 600,
  ringTiltX: 12,
} as const;

/** Darken a hex color by a factor (0–1, where 0 = black) */
export function darkenColor(hex: string, factor: number): string {
  const c = hexToRGB(hex);
  if (!c) return hex;
  const f = Math.max(0, Math.min(1, factor));
  return rgbToHex(
    Math.round(c.r * f),
    Math.round(c.g * f),
    Math.round(c.b * f),
  );
}

/** Lighten a hex color by a factor (0–1, where 1 = white) */
export function lightenColor(hex: string, factor: number): string {
  const c = hexToRGB(hex);
  if (!c) return hex;
  const f = Math.max(0, Math.min(1, factor));
  return rgbToHex(
    Math.round(c.r + (255 - c.r) * f),
    Math.round(c.g + (255 - c.g) * f),
    Math.round(c.b + (255 - c.b) * f),
  );
}

/**
 * Generate SVG `d` path strings for the right-face and top-face
 * of a 3D bar extrusion.
 *
 *  ┌─────────┐ top face (parallelogram)
 *  │  front   │
 *  │  rect    │ → right face (parallelogram)
 *  └─────────┘
 *
 * @param x  left of the front face
 * @param y  top of the front face
 * @param w  width of the front face
 * @param h  height of the front face
 * @param dx extrusion X offset (positive = right)
 * @param dy extrusion Y offset (negative = up)
 */
export function bar3DPaths(
  x: number,
  y: number,
  w: number,
  h: number,
  dx: number = CHART_3D.barDx,
  dy: number = CHART_3D.barDy,
) {
  // Right face: from right edge of front rect, extruded
  const rightFace = [
    `M ${x + w} ${y}`,
    `L ${x + w + dx} ${y + dy}`,
    `L ${x + w + dx} ${y + h + dy}`,
    `L ${x + w} ${y + h}`,
    "Z",
  ].join(" ");

  // Top face: from top edge of front rect, extruded
  const topFace = [
    `M ${x} ${y}`,
    `L ${x + dx} ${y + dy}`,
    `L ${x + w + dx} ${y + dy}`,
    `L ${x + w} ${y}`,
    "Z",
  ].join(" ");

  return { rightFace, topFace };
}

// ---- Internal helpers ----

function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
  );
}
