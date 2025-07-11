import Vec2Math from "../../Vec2/vec2-math";
import type { Vec2 } from "../../Vec2/Vec2";
import type { Bounds } from "../types/Bounds";
import { getBoundsCenterInto, getBoxOverlapInto, getSeparationDirection } from "../util/getCircleCenter";

const _overlap = Vec2Math.createZero();
const _centerA = Vec2Math.createZero();
const _centerB = Vec2Math.createZero();

export function resolveBoxBoxOverlap(
  a: Bounds,
  b: Bounds
): Vec2 | null {

  getBoxOverlapInto(a, b, _overlap);

  if (_overlap.x <= 0 || _overlap.y <= 0) return null;

  getBoundsCenterInto(a, _centerA);
  getBoundsCenterInto(b, _centerB);

  if (_overlap.x < _overlap.y) {
    return { x: getSeparationDirection(_centerA.x, _centerB.x, _overlap.x), y: 0 };
  } else {
    return { x: 0, y: getSeparationDirection(_centerA.y, _centerB.y, _overlap.y) };
  }
}

