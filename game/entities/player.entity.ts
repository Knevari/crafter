import { createAnimator } from "../../core/builders/createAnimator";
import { createGameEntity } from "../../core/builders/createGameEntity";
import { getId } from "../../core/builders/createId";
import { createSpriteRender } from "../../core/builders/createSpriteRender";
import type { BoxColliderComponent } from "../../core/gears/collider/box/BoxCollider";
import type { CircleColliderComponent } from "../../core/collider/types/CircleCollider";
import { createTransform } from "../../core/gears/transform/transform.types";
import { ComponentType } from "../../core/types/component-type";
import type { GameEntity } from "../../core/types/EngineEntity";
import { PLAYER_ANIMATOR_CONTROLLER } from "../controllers/player.animator.controller";
import type { AnimatorComponent } from "../../core/gears/animator";
import type { ECSComponentState } from "../../core/gears/ecs/component";
import { ECS } from "../../engine/TwoD";

export function createPlayer(componentState: ECSComponentState, name: string) {

  const gameEntity: GameEntity = createGameEntity(name, "player");

  const transform = createTransform(gameEntity);
  ECS.Component.addComponent(componentState, gameEntity, transform);

  ECS.Component.addComponent<BoxColliderComponent>(componentState, gameEntity, {
    instanceId: getId(),
    gameEntity: gameEntity,
    category: ComponentType.COLLIDER,
    type: ComponentType.BOX_COLLIDER,
    ignoreSelfCollisions: true,
    size: { x: 32, y: 32 },
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: false
  });

  ECS.Component.addComponent<CircleColliderComponent>(componentState, gameEntity, {
    instanceId: getId(),
    enabled: true,
    ignoreSelfCollisions: true,
    radius: 12,
    isTrigger: false,
    offset: { x: 0, y: -8 },
    type: ComponentType.CIRCLE_COLLIDER,
    category: ComponentType.COLLIDER,
    gameEntity: gameEntity,
    collisionGroup: "player"
  })


  ECS.Component.addComponent(componentState, gameEntity, {
    instanceId: getId(),
    gameEntity: gameEntity,
    type: ComponentType.CHARACTER_CONTROLLER,
    category: ComponentType.CHARACTER_CONTROLLER,
    enabled: true,
    facing: "side",
    state: "idle",
    direction: { x: 0, y: 0 },
    moving: false,
    speed: 80,
    runSpeed: 100

  });

  const spriteRener = createSpriteRender(gameEntity, { scale: 2, layer: 10 });
  ECS.Component.addComponent(componentState, gameEntity, spriteRener);

  const animator = createAnimator(gameEntity, PLAYER_ANIMATOR_CONTROLLER);
  ECS.Component.addComponent<AnimatorComponent>(componentState, gameEntity, animator);

  return gameEntity;
}

