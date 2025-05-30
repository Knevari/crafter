import type { Vector2 } from "../../types/vector2";
import type { CircleColliderComponent } from "../circle-collider";

export function testCircleCircleOverlap(
  aPos: Vector2,
  aCol: CircleColliderComponent,
  bPos: Vector2,
  bCol: CircleColliderComponent
): boolean {
  const aOffset = aCol.offset ?? { x: 0, y: 0 };
  const bOffset = bCol.offset ?? { x: 0, y: 0 };

  const ax = aPos.x + aOffset.x;
  const ay = aPos.y + aOffset.y;
  const bx = bPos.x + bOffset.x;
  const by = bPos.y + bOffset.y;

  const dx = bx - ax;
  const dy = by - ay;
  const distanceSq = dx * dx + dy * dy;
  const radiusSum = aCol.radius + bCol.radius;

  return distanceSq <= radiusSum * radiusSum;
}
