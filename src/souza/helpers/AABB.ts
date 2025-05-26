import type { BoxColliderComponent } from "../types/collider-box";
import type { PositionComponent } from "../types/component-position";
const EPSILON = 0.001;

export function checkAABBCollision(
  aPos: PositionComponent,
  aCol: BoxColliderComponent,
  bPos: PositionComponent,
  bCol: BoxColliderComponent
): boolean {
  const ax = aPos.x + (aCol.offsetX ?? 0);
  const ay = aPos.y + (aCol.offsetY ?? 0);
  const bx = bPos.x + (bCol.offsetX ?? 0);
  const by = bPos.y + (bCol.offsetY ?? 0);

  return (
    ax < bx + bCol.width &&
    ax + aCol.width > bx &&
    ay < by + bCol.height &&
    ay + aCol.height > by
  );
}

export function resolveAABBCollision(
  aPos: PositionComponent,
  aBox: BoxColliderComponent,
  bPos: PositionComponent,
  bBox: BoxColliderComponent
) {
  const ax = aPos.x + (aBox.offsetX ?? 0);
  const ay = aPos.y + (aBox.offsetY ?? 0);
  const bx = bPos.x + (bBox.offsetX ?? 0);
  const by = bPos.y + (bBox.offsetY ?? 0);

  const ax1 = ax;
  const ay1 = ay;
  const ax2 = ax + aBox.width;
  const ay2 = ay + aBox.height;

  const bx1 = bx;
  const by1 = by;
  const bx2 = bx + bBox.width;
  const by2 = by + bBox.height;

  const overlapX = Math.min(ax2, bx2) - Math.max(ax1, bx1);
  const overlapY = Math.min(ay2, by2) - Math.max(ay1, by1);

  if (overlapX < overlapY) {
    const directionX = ax + aBox.width / 2 < bx + bBox.width / 2 ? -1 : 1;
    aPos.x += (overlapX + EPSILON) * directionX;
  } else {
    const directionY = ay + aBox.height / 2 < by + bBox.height / 2 ? -1 : 1;
    aPos.y += (overlapY + EPSILON) * directionY;
  }
}
