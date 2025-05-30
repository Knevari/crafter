import type { Vector2 } from "../../types/vector2";
import type { CircleColliderComponent } from "../circle-collider";
import { getCircleCenter } from "../getCircleCenter";

export function resolveCircleCircleOverlap(
  aPos: Vector2,
  aCol: CircleColliderComponent,
  bPos: Vector2,
  bCol: CircleColliderComponent
): { dx: number; dy: number } | null {
  const aCenter = getCircleCenter(aPos, aCol);
  const bCenter = getCircleCenter(bPos, bCol);

  const dx = bCenter.x - aCenter.x;
  const dy = bCenter.y - aCenter.y;
  const distSq = dx * dx + dy * dy;
  const radiiSum = aCol.radius + bCol.radius;

  if (distSq >= radiiSum * radiiSum) return null; 

  const dist = Math.sqrt(distSq) || 0.0001;
  const overlap = radiiSum - dist;

  return {
    dx: -(dx / dist) * overlap,
    dy: -(dy / dist) * overlap
  };
}