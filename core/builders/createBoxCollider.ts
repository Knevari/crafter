import type { BoxColliderComponent } from "../gears/collider/box/BoxCollider";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { getId } from "./createId";

type BoxColliderOptions = Partial<Omit<BoxColliderComponent, "entity">>;

export function createBoxCollider(
  gameEntity: GameEntity,
  options: BoxColliderOptions = {},
): BoxColliderComponent {
  return {
    instanceId: getId(),
    type: ComponentType.BOX_COLLIDER,
    ignoreSelfCollisions: true,
    gameEntity: gameEntity,
    size: { x: 32, y: 32 },
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: false,
    collisionGroup: "default",
    ...options,
  };
}
