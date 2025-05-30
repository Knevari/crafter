import type { ECSComponents } from "../ecs/ecs-components";
import type { CollisionEvent, TriggerEvent } from "./collision-event";

export interface System {
    priority?: number;
    start?: (ecs: ECSComponents) => void;
    update?: (ecs: ECSComponents, deltaTime: number) => void;
    fixedUpdate?: (ecs: ECSComponents) => void;
    latedUpdate?: (ecs: ECSComponents) => void;
    render?: (ecs: ECSComponents) => void;
    onDrawGizmos?: (ecs: ECSComponents) => void;

    onCollisionEnter?: (ecs: ECSComponents, collisionEvent: CollisionEvent) => void;
    onCollisionStay?: (ecs: ECSComponents, collisionEvent: CollisionEvent) => void;
    onCollisionExit?: (ecs: ECSComponents, collisionEvent: CollisionEvent) => void;

    onTriggerEnter?: (ecs: ECSComponents, collisionEvent: TriggerEvent) => void;
    onTriggerStay?: (ecs: ECSComponents, collisionEvent: TriggerEvent) => void;
    onTriggerExit?: (ecs: ECSComponents, collisionEvent: TriggerEvent) => void;
}
