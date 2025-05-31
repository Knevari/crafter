export function lerpColor(hexA: string, hexB: string, t: number): string {

  hexA = hexA.trim().replace("#", "");
  hexB = hexB.trim().replace("#", "");

  const aR = parseInt(hexA.substring(0, 2), 16);
  const aG = parseInt(hexA.substring(2, 4), 16);
  const aB = parseInt(hexA.substring(4, 6), 16);

  const bR = parseInt(hexB.substring(0, 2), 16);
  const bG = parseInt(hexB.substring(2, 4), 16);
  const bB = parseInt(hexB.substring(4, 6), 16);

  const r = Math.round(aR + (bR - aR) * t);
  const g = Math.round(aG + (bG - aG) * t);
  const b = Math.round(aB + (bB - aB) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
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
