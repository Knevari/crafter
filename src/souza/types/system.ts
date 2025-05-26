import type { ECSComponents } from "../ecs/ecs-components";
import type { CollisionEvent } from "./collision-event";

export interface System {
    priority?: number,
    update?: (ecs: ECSComponents, deltaTime: number) => void;
    fixedUpdate?: (ecs: ECSComponents) => void;
    latedUpdate?: (ecs: ECSComponents) => void;
    render?: (ecs: ECSComponents) => void;
    onDrawGizmos?:(ecs: ECSComponents) => void;
    onCollisionStay?: (collisionEvent: CollisionEvent) => void;
}
