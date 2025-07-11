import Vec2Math from "../../Vec2/vec2-math";
import type { Vec2 } from "../../Vec2/Vec2";
import type { Bounds } from "../types/Bounds";
import {  getClosestPoint } from "../util/getCircleCenter";

const closestPointResult: Vec2 = { x: 0, y: 0 };
const delta: Vec2 = { x: 0, y: 0 };
const normal: Vec2 = { x: 0, y: 0 };

export function resolveBoxCircleOverlap(
  boxBounds: Bounds,
  circlePos: Vec2,
  circleRadius: number
): Vec2 | null {
  getClosestPoint(boxBounds, circlePos, closestPointResult);

  Vec2Math.subtractInto(circlePos, closestPointResult, delta);
  
  const distSq = Vec2Math.lengthSquared(delta);

  if (distSq >= circleRadius * circleRadius) return null;

  const dist = Math.sqrt(distSq) || 0.0001;

  Vec2Math.normalizeInto(delta, normal);

  const overlap = circleRadius - dist;

  return {
    x: -normal.x * overlap,
    y: -normal.y * overlap,
  };
}
