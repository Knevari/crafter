import type { CircleColliderComponent } from "../collider/types/CircleCollider";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { getId } from "./createId";
type CircleColliderOptions = Partial<Omit<CircleColliderComponent, "entityRef">>;

export function createCircleCollider(gameEntity: GameEntity, options: CircleColliderOptions): CircleColliderComponent {
    return {
        gameEntity: gameEntity,
        ignoreSelfCollisions: true,
        instanceId: getId(),
        type: ComponentType.CIRCLE_COLLIDER,
        collisionGroup: "default",
        isTrigger: false,
        radius: 32,
        enabled: true,
        ...options
    }
}