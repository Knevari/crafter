import type { Entity } from "../../lib/types";
import type { CircleColliderComponent } from "../collider/circle-collider";
import { ComponentType } from "../types/component-type";
import { getId } from "./createId";
type CircleColliderOptions = Partial<Omit<CircleColliderComponent, "entityRef">>;

export function createCircleCollider(entity: Entity, options: CircleColliderOptions): CircleColliderComponent {
    return {
        entityRef: entity,
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