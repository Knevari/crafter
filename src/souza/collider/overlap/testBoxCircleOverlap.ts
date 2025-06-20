import type { Vec2 } from "../../Vec2/Vec2";
import type { Bounds } from "../types/Bounds";
import { distanceSq, getClosestPoint } from "../util/getCircleCenter";

const closestPointResult: Vec2 = { x: 0, y: 0 };

export function testBoxCircleOverlap(
  boxBounds: Bounds,
  circlePos: Vec2,
  circleRadius: number
): boolean {

  getClosestPoint(boxBounds, circlePos, closestPointResult);
  const distSq = distanceSq(circlePos, closestPointResult);
  return distSq <= (circleRadius * circleRadius);
}