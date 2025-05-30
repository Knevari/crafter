import type { Vector2 } from "../../types/vector2";
import type { CircleColliderComponent } from "../circle-collider";
import { getAABBMinMax } from "../getAABBMinMax";
import { getCircleCenter } from "../getCircleCenter";
import type { BoxColliderComponent } from "../IBoxCollider";

export function resolveBoxCircleOverlap(
  boxPos: Vector2,
  box: BoxColliderComponent,
  circlePos: Vector2,
  circle: CircleColliderComponent
): { dx: number; dy: number } | null {

  const bounds = getAABBMinMax(boxPos, box);
  const circleCenter = getCircleCenter(circlePos, circle);

  const closestPoint = {
    x: Math.max(bounds.min.x, Math.min(circleCenter.x, bounds.max.x)),
    y: Math.max(bounds.min.y, Math.min(circleCenter.y, bounds.max.y)),
  };

  const dx = circleCenter.x - closestPoint.x;
  const dy = circleCenter.y - closestPoint.y;
  const distSq = dx * dx + dy * dy;
  const radius = circle.radius;

  if (distSq >= radius * radius) return null;

  const dist = Math.sqrt(distSq) || 0.0001;
  const overlap = radius - dist;

  return {
    dx: -(dx / dist) * overlap,
    dy: -(dy / dist) * overlap,
  };
}
