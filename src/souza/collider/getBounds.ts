import type { Vector2 } from "../types/vector2";
import type { BoxColliderComponent } from "./IBoxCollider";

export function getBounds(pos: Vector2, col: BoxColliderComponent) {
  const offset = col.offset ?? { x: 0, y: 0 }

  const x = pos.x + offset.x - col.width / 2;
  const y = pos.y + offset.y - col.height / 2;

  return {
    left: x,
    right: x + col.width,
    top: y,
    bottom: y + col.height,
  };
}
