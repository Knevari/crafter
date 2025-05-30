import type { Vector2 } from "../../types/vector2";
import { getBounds } from "../getBounds";
import type { BoxColliderComponent } from "../IBoxCollider";

export function testBoxBoxOverlap(
  aPos: Vector2,
  aCol: BoxColliderComponent,
  bPos: Vector2,
  bCol: BoxColliderComponent
): boolean {
  const a = getBounds(aPos, aCol);
  const b = getBounds(bPos, bCol);

  const collision =
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top;

  return collision;
}




