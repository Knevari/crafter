import type { Bounds } from "../types/Bounds";


export function testBoxBoxOverlap(a: Bounds, b: Bounds): boolean {
  if (a.right <= b.left) return false;
  if (a.left >= b.right) return false;
  if (a.bottom <= b.top) return false;
  if (a.top >= b.bottom) return false;

  return true;
}