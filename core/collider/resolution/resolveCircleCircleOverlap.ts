import Vec2Math from "../../Vec2/vec2-math";
import type { Vec2 } from "../../Vec2/Vec2";
import { EPSILON } from "../util/getCircleCenter";

const _tmp = {
  delta: { x: 0, y: 0 },
};

export function resolveCircleCircleOverlap(
  aPos: Vec2,
  aRadius: number,
  bPos: Vec2,
  bRadius: number
): Vec2 | null {

  if (aRadius <= 0 || bRadius <= 0) return null;

  Vec2Math.subtractInto(bPos, aPos, _tmp.delta);
  const distSq = Vec2Math.lengthSquared(_tmp.delta);

  const radiiSum = aRadius + bRadius;
  if (distSq >= radiiSum * radiiSum) return null;

  const dist = Math.sqrt(distSq) || EPSILON;
  const overlap = radiiSum - dist;

  return {
    x: -(_tmp.delta.x / dist) * overlap,
    y: -(_tmp.delta.y / dist) * overlap
  };
}