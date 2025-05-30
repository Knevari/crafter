import { ComponentType } from "../../types/component-type";
import type { Vector2 } from "../../types/vector2";
import { testBoxBoxOverlap } from "./testBoxBoxOverlap";
import { testBoxCircleOverlap } from "./testBoxCircleOverlap";
import { testCircleCircleOverlap } from "./testCircleCircleOverlap";
import type { CircleColliderComponent } from "../circle-collider";
import type { Collider } from "../collider";
import type { BoxColliderComponent } from "../IBoxCollider";

export function testOverlap(aPos: Vector2, a: Collider, bPos: Vector2, b: Collider): boolean {
  if (a.type === ComponentType.BOX_COLLIDER && b.type === ComponentType.BOX_COLLIDER) {
    return testBoxBoxOverlap(aPos, a as BoxColliderComponent, bPos, b as BoxColliderComponent);
  }
  if (a.type === ComponentType.CIRCLE_COLLIDER && b.type === ComponentType.CIRCLE_COLLIDER) {
    return testCircleCircleOverlap(aPos, a as CircleColliderComponent, bPos, b as CircleColliderComponent);
  }
  if (a.type === ComponentType.BOX_COLLIDER && b.type === ComponentType.CIRCLE_COLLIDER) {
    return testBoxCircleOverlap(aPos, a as BoxColliderComponent, bPos, b as CircleColliderComponent);
  }
  if (a.type === ComponentType.CIRCLE_COLLIDER && b.type === ComponentType.BOX_COLLIDER) {
    return testBoxCircleOverlap(bPos, b as BoxColliderComponent, aPos, a as CircleColliderComponent);
  }
  return false;
}
