function lerpColor(a: string, b: string, t: number): string {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  if (!c1 || !c2) return a;
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b_ = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b_})`;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  } : null;
}

export function getColorFromGradient(colors: string[], t: number): string {
  if (colors.length === 0) return "#000000";
  if (colors.length === 1) return colors[0];

  t = Math.max(0, Math.min(1, t));

  const total = colors.length - 1;
  const scaledT = t * total;
  const index = Math.floor(scaledT);
  const localT = scaledT - index;

  const colorA = colors[index];
  const colorB = colors[index + 1] ?? colorA;

  return lerpColor(colorA, colorB, localT);
}

