export function isColliding(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number,
): boolean {
  const left1 = x1 - w1 / 2;
  const right1 = x1 + w1 / 2;
  const top1 = y1 - h1 / 2;
  const bottom1 = y1 + h1 / 2;

  const left2 = x2 - w2 / 2;
  const right2 = x2 + w2 / 2;
  const top2 = y2 - h2 / 2;
  const bottom2 = y2 + h2 / 2;

  return !(
    right1 <= left2 ||
    left1 >= right2 ||
    bottom1 <= top2 ||
    top1 >= bottom2
  );
}
