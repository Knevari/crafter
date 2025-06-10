import { ComponentType } from "../../types/component-type";
import { testBoxBoxOverlap } from "./testBoxBoxOverlap";
import { testBoxCircleOverlap } from "./testBoxCircleOverlap";
import { testCircleCircleOverlap } from "./testCircleCircleOverlap";
import type { CircleColliderComponent } from "../types/CircleCollider";
import type { Collider } from "../types/Collider";
import type { BoxColliderComponent } from "../types/BoxCollider";
import type { Vec2 } from "../../Vec2/Vec2";
import { isOfType } from "../util/isOfType";
import Vec2Math from "../../helpers/vec2-math";
import { getBounds } from "../util/getCircleCenter";
import type { Bounds } from "../types/Bounds";

export function testOverlap(aPos: Vec2, a: Collider, bPos: Vec2, b: Collider): boolean {
  if (isOfType<BoxColliderComponent>(a, ComponentType.BOX_COLLIDER) &&
    isOfType<BoxColliderComponent>(b, ComponentType.BOX_COLLIDER)) {

    const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
    const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });

    const aBounds: Bounds = getBounds(offsetA, a.size);
    const bBounds: Bounds = getBounds(offsetB, b.size);
    return testBoxBoxOverlap(aBounds, bBounds);
  }

  if (isOfType<CircleColliderComponent>(a, ComponentType.CIRCLE_COLLIDER) &&
    isOfType<CircleColliderComponent>(b, ComponentType.CIRCLE_COLLIDER)) {

    const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
    const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });
    return testCircleCircleOverlap(offsetA, a.radius, offsetB, b.radius);
  }

  if (isOfType<BoxColliderComponent>(a, ComponentType.BOX_COLLIDER) &&
    isOfType<CircleColliderComponent>(b, ComponentType.CIRCLE_COLLIDER)) {

    const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
    const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });

    const bounds = getBounds(offsetA, a.size);
    return testBoxCircleOverlap(bounds, offsetB, b.radius);
  }

  if (isOfType<CircleColliderComponent>(a, ComponentType.CIRCLE_COLLIDER) &&
    isOfType<BoxColliderComponent>(b, ComponentType.BOX_COLLIDER)) {

    const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
    const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });

    const bounds = getBounds(offsetB, b.size);
    return testBoxCircleOverlap(bounds, offsetA, a.radius);
  }

  return false;
}
