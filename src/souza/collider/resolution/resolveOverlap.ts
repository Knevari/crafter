import { ComponentType } from "../../types/component-type";
import type { Vector2 } from "../../types/vector2";
import type { CircleColliderComponent } from "../circle-collider";
import type { Collider } from "../collider";
import type { BoxColliderComponent } from "../IBoxCollider";
import { resolveBoxBoxOverlap } from "./resolveBoxBoxCollision";
import { resolveBoxCircleOverlap } from "./resolveBoxCircleOverlap";
import { resolveCircleCircleOverlap } from "./resolveCircleCircleOverlap";
export interface CollisionResolution {
  dx: number;
  dy: number;
}

export function resolveOverlap(aPos: Vector2, a: Collider, bPos: Vector2, b: Collider): CollisionResolution | null {
  if (a.type === ComponentType.BOX_COLLIDER && b.type === ComponentType.BOX_COLLIDER) {
    return resolveBoxBoxOverlap(aPos, a as BoxColliderComponent, bPos, b as BoxColliderComponent);
  }
  if (a.type === ComponentType.CIRCLE_COLLIDER && b.type === ComponentType.CIRCLE_COLLIDER) {
    return resolveCircleCircleOverlap(aPos, a as CircleColliderComponent, bPos, b as CircleColliderComponent);
  }
  if (a.type === ComponentType.BOX_COLLIDER && b.type === ComponentType.CIRCLE_COLLIDER) {
    return resolveBoxCircleOverlap(aPos, a as BoxColliderComponent, bPos, b as CircleColliderComponent);
  }

  // atencao ------------> nao testado
  if (a.type === ComponentType.CIRCLE_COLLIDER && b.type === ComponentType.BOX_COLLIDER) {
    const res = resolveBoxCircleOverlap(bPos, b as BoxColliderComponent, aPos, a as CircleColliderComponent);
    if (res) {
      res.dx *= -1;
      res.dy *= -1;
    }
    return res;
  }

  return null;
}