import type { Entity } from "../../lib/types";
import type { BoxColliderComponent } from "../collider/IBoxCollider";
import { ComponentType } from "../types/component-type";
import { getId } from "./createId";

type BoxColliderOptions = Partial<Omit<BoxColliderComponent, "entity">>;

export function createBoxCollider(
  entity: Entity,
  options: BoxColliderOptions = {}
): BoxColliderComponent {
  return {
    instanceId: getId(),
    type: ComponentType.BOX_COLLIDER,
    ignoreSelfCollisions: true,
    entityRef: entity,
    width: 32,
    height: 32,
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: false,
    collisionGroup: "default",
    ...options,
  };
}
