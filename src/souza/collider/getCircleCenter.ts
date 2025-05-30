import type { Vector2 } from "../types/vector2";
import type { CircleColliderComponent } from "./circle-collider";

export function getCircleCenter(pos: Vector2, col: CircleColliderComponent): Vector2 {
  const offset = col.offset ?? { x: 0, y: 0 };
  return {
    x: pos.x + offset.x,
    y: pos.y + offset.y
  };
}
