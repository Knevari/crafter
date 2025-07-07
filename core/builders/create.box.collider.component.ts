import type { BoxColliderComponent, BoxColliderOptions } from "../gears/collider/box/BoxCollider";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export function createBoxColliderComponent(gameEntity: GameEntity, options?: BoxColliderOptions): BoxColliderComponent {
    return {
        gameEntity: gameEntity,
        category: ComponentType.COLLIDER,
        type: ComponentType.BOX_COLLIDER,
        enabled: true,
        ignoreSelfCollisions: true,
        instanceId: createIncrementalId(),
        isTrigger: false,
        offset: { x: 0, y: 0 },
        size: { x: 0.5, y: 0.5 },
        ...options
    }
}