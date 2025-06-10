import type { Entity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import { ComponentType } from "../types/component-type";
import { PLAYER_CONTROLLER } from "../animator/controllers/player-controller";
import { createSpriteRender } from "../builders/createSpriteRender";
import { createBoxCollider } from "../builders/createBoxCollider";
import { createAnimator } from "../builders/createAnimator";
import { createTransform } from "../components/transform";
import type { CircleColliderComponent } from "../collider/types/CircleCollider";
import { getId } from "../builders/createId";
import { createEntity } from "../builders/createEntity";
import type { BoxColliderComponent } from "../collider/types/BoxCollider";

export function createPlayer(ecs: ECSComponents, name: string) {

  const entity: Entity = createEntity("player", "player");

  const transform = createTransform(entity);
  ecs.addComponent(entity, transform);

  // ecs.addComponent<BoxColliderComponent>(entity, {
  //   instanceId: getId(),
  //   type: ComponentType.BOX_COLLIDER,
  //   ignoreSelfCollisions: true,
  //   size: { x: 32, y: 32 },
  //   offset: { x: 0, y: 0 },
  //   enabled: true,
  //   isTrigger: false
  // });

  ecs.addComponent<CircleColliderComponent>(entity, {
    instanceId: getId(),
    enabled: true,
    ignoreSelfCollisions: true,
    radius: 12,
    isTrigger: false,
    offset: {x: 0, y: -8},
    type: ComponentType.CIRCLE_COLLIDER,
    entityRef: entity,
    collisionGroup: "player"
  })


  ecs.addComponent(entity, {
    instanceId: getId(),
    type: ComponentType.CHARACTER_CONTROLLER,
    enabled: true,
    facing: "side",
    state: "idle",
    direction: { x: 0, y: 0 },
    moving: false,
    speed: 80,
    runSpeed: 100

  });

  const spriteRener = createSpriteRender(entity, { scale: 2, layer: 10 });
  ecs.addComponent(entity, spriteRener);

  const animator = createAnimator(entity, PLAYER_CONTROLLER);
  ecs.addComponent<AnimatorComponent>(entity, animator);

  return entity;
}

