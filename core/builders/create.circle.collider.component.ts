import type { CircleColliderComponent, CircleColliderOptions } from "../collider/types/CircleCollider";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export function createCircleColliderComponent(gameEntity: GameEntity, options?: CircleColliderOptions): CircleColliderComponent {
    return {
        gameEntity: gameEntity,
        category: ComponentType.COLLIDER,
        type: ComponentType.CIRCLE_COLLIDER,
        enabled: true,
        ignoreSelfCollisions: true,
        instanceId: createIncrementalId(),
        isTrigger: false,
        offset: { x: 0, y: 0 },
        radius: 32,
        ...options
    }
}