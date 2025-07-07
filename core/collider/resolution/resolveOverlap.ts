import { ComponentType } from "../../types/component-type";
import type { Vec2 } from "../../Vec2/Vec2";
import type { Collider } from "../types/Collider";
import { isOfType } from "../util/isOfType";
import { resolveBoxBoxOverlap } from "./resolveBoxBoxCollision";
import { getBounds } from "../util/getCircleCenter";
import type { BoxColliderComponent } from "../../gears/collider/box/BoxCollider";

export interface CollisionResolution {
  dx: number;
  dy: number;
}

export function resolveOverlap(aPos: Vec2, a: Collider, bPos: Vec2, b: Collider): Vec2 | null {
  if (isOfType<BoxColliderComponent>(a, ComponentType.BOX_COLLIDER) &&
    isOfType<BoxColliderComponent>(b, ComponentType.BOX_COLLIDER)) {

    const aBox = a as BoxColliderComponent;
    const bBox = a as BoxColliderComponent;

    const boundsA = getBounds(aPos, aBox.size);
    const boundsB = getBounds(bPos, bBox.size);

    return resolveBoxBoxOverlap(boundsA, boundsB);
  }
  return null;
}
