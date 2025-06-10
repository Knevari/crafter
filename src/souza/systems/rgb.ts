import type { HSL } from "./hsl";

export interface RGB {
  r: number;
  g: number; 
  b: number;
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;

  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

  return p;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; 
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const H = h / 360;

    r = hueToRgb(p, q, H + 1 / 3);
    g = hueToRgb(p, q, H);
    b = hueToRgb(p, q, H - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}
