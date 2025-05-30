import type { Vector2 } from "../../types/vector2";
import type { CircleColliderComponent } from "../circle-collider";
import { clamp } from "../clamp";
import type { BoxColliderComponent } from "../IBoxCollider";

export function testBoxCircleOverlap(
    boxPos: Vector2,
    boxCol: BoxColliderComponent,
    circlePos: Vector2,
    circleCol: CircleColliderComponent
): boolean {
    const boxOffset = boxCol.offset ?? { x: 0, y: 0 };
    const circleOffset = circleCol.offset ?? { x: 0, y: 0 };

    const boxX = boxPos.x + boxOffset.x;
    const boxY = boxPos.y + boxOffset.y;

    const circleX = circlePos.x + circleOffset.x;
    const circleY = circlePos.y + circleOffset.y;

    const boxHalfWidth = boxCol.width / 2;
    const boxHalfHeight = boxCol.height / 2;

    const closestX = clamp(circleX, boxX - boxHalfWidth, boxX + boxHalfWidth);
    const closestY = clamp(circleY, boxY - boxHalfHeight, boxY + boxHalfHeight);

    const dx = circleX - closestX;
    const dy = circleY - closestY;

    return (dx * dx + dy * dy) <= (circleCol.radius * circleCol.radius);
}
