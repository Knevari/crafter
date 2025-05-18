export function lerp(a: number, b: number, dt: number) {
  return a + (b - a) * dt;
}
