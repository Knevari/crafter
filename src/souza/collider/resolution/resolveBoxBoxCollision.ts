import type { Vector2 } from "../../types/vector2";
import { getAABBMinMax } from "../getAABBMinMax";
import type { BoxColliderComponent } from "../IBoxCollider";

export function resolveBoxBoxOverlap(
  aPos: Vector2,
  aCol: BoxColliderComponent,
  bPos: Vector2,
  bCol: BoxColliderComponent
): { dx: number; dy: number } | null {
  const a = getAABBMinMax(aPos, aCol);
  const b = getAABBMinMax(bPos, bCol);

  const overlapX = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
  const overlapY = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);

  if (overlapX <= 0 || overlapY <= 0) return null;

  if (overlapX < overlapY) {
    const aCenterX = (a.min.x + a.max.x) / 2;
    const bCenterX = (b.min.x + b.max.x) / 2;
    const dx = aCenterX < bCenterX ? -overlapX : overlapX;
    return { dx, dy: 0 };
  } else {
    const aCenterY = (a.min.y + a.max.y) / 2;
    const bCenterY = (b.min.y + b.max.y) / 2;
    const dy = aCenterY < bCenterY ? -overlapY : overlapY;
    return { dx: 0, dy };
  }
}