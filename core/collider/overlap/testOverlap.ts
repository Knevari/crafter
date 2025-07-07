import { ComponentType } from "../../types/component-type";
import { testBoxBoxOverlap } from "./testBoxBoxOverlap";
import type { Collider } from "../types/Collider";
import type { Vec2 } from "../../Vec2/Vec2";
import { isOfType } from "../util/isOfType";
import Vec2Math from "../../helpers/vec2-math";
import { getBounds } from "../util/getCircleCenter";
import type { Bounds } from "../types/Bounds";
import type { BoxColliderComponent } from "../../gears/collider/box/BoxCollider";

export function testOverlap(aPos: Vec2, a: Collider, bPos: Vec2, b: Collider): boolean {
  if (isOfType<BoxColliderComponent>(a, ComponentType.BOX_COLLIDER) &&
    isOfType<BoxColliderComponent>(b, ComponentType.BOX_COLLIDER)) {

    const offsetA = Vec2Math.add(aPos, a.offset ?? { x: 0, y: 0 });
    const offsetB = Vec2Math.add(bPos, b.offset ?? { x: 0, y: 0 });

    const aBounds: Bounds = getBounds(offsetA, a.size);
    const bBounds: Bounds = getBounds(offsetB, b.size);
    return testBoxBoxOverlap(aBounds, bBounds);
  }

  return false;
}
