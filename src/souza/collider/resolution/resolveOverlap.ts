import { ComponentType } from "../../types/component-type";
import type { Vec2 } from "../../Vec2/Vec2";
import type { CircleColliderComponent } from "../types/CircleCollider";
import type { Collider } from "../types/Collider";
import type { BoxColliderComponent } from "../types/BoxCollider";
import { isOfType } from "../util/isOfType";
import { resolveBoxBoxOverlap } from "./resolveBoxBoxCollision";
import { resolveBoxCircleOverlap } from "./resolveBoxCircleOverlap";
import { resolveCircleCircleOverlap } from "./resolveCircleCircleOverlap";
import Vec2Math from "../../helpers/vec2-math";
import { getBounds } from "../util/getCircleCenter";

export interface CollisionResolution {
  dx: number;
  dy: number;
}

export function resolveOverlap(aPos: Vec2, a: Collider, bPos: Vec2, b: Collider): Vec2 | null {
  // if (isOfType<BoxColliderComponent>(a, ComponentType.BOX_COLLIDER) &&
  //   isOfType<BoxColliderComponent>(b, ComponentType.BOX_COLLIDER)) {

  //   const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
  //   const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });
  //   return resolveBoxBoxOverlap(offsetA, a.size, offsetB, b.size);
  // }

  // if (isOfType<CircleColliderComponent>(a, ComponentType.CIRCLE_COLLIDER) &&
  //   isOfType<CircleColliderComponent>(b, ComponentType.CIRCLE_COLLIDER)) {

  //   const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
  //   const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });
  //   return resolveCircleCircleOverlap(offsetA, a.radius, offsetB, b.radius);
  // }

  if (isOfType<BoxColliderComponent>(a, ComponentType.BOX_COLLIDER) &&
    isOfType<CircleColliderComponent>(b, ComponentType.CIRCLE_COLLIDER)) {

    const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
    const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });

    const bounds = getBounds(offsetA, a.size);
    return resolveBoxCircleOverlap(bounds, offsetB, b.radius);
  }

  // if (isOfType<CircleColliderComponent>(a, ComponentType.CIRCLE_COLLIDER) &&
  //   isOfType<BoxColliderComponent>(b, ComponentType.BOX_COLLIDER)) {

  //   const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
  //   const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });

  //   const bounds = getBounds(offsetB, b.size);
  //   const res = resolveBoxCircleOverlap(bounds, offsetA, a.radius);
  //   if (res) {
  //     res.x *= -1;
  //     res.y *= -1;
  //   }
  //   return res;
  // }

  return null;
}
