import type { RGB } from "./rgb";

export interface HSL {
  h: number; // 0–360
  s: number; // 0–1
  l: number; // 0–1
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h,
    s,
    l,
  };
}



function lerpHue(a: number, b: number, t: number): number {
 
  let d = b - a;
  if (d > 180) d -= 360;
  else if (d < -180) d += 360;
  let h = a + d * t;
  if (h < 0) h += 360;
  else if (h >= 360) h -= 360;
  return h;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpHSL(c1: HSL, c2: HSL, t: number): HSL {
  return {
    h: lerpHue(c1.h, c2.h, t),
    s: lerp(c1.s, c2.s, t),
    l: lerp(c1.l, c2.l, t),
  };
}
