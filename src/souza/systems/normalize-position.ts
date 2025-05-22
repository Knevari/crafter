import type { PositionComponent } from "../types/component-position";

export function normalize(v: PositionComponent): PositionComponent {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  if (length === 0) {
    return { x: 0, y: 0 }; 
  }
  return { x: v.x / length, y: v.y / length };
}