import type { Vec2 } from "../../Vec2/Vec2";
import { distanceSq } from "../util/getCircleCenter";

export function testCircleCircleOverlap(aPos: Vec2, aRadius: number, bPos: Vec2, bRadius: number): boolean {
  if (aRadius <= 0 || bRadius <= 0) return false;

  const distSq = distanceSq(bPos, aPos);
  const radiusSum = aRadius + bRadius;

  return distSq <= radiusSum * radiusSum;
}