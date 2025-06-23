import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import { ComponentType } from "../types/component-type";
import { PLAYER_CONTROLLER } from "../animator/controllers/player-controller";
import { createSpriteRender } from "../builders/createSpriteRender";
import { createAnimator } from "../builders/createAnimator";
import { createTransform } from "../components/transform";
import type { CircleColliderComponent } from "../collider/types/CircleCollider";
import { getId } from "../builders/createId";
import { createGameEntity } from "../builders/createGameEntity";
import type { BoxColliderComponent } from "../collider/types/BoxCollider";
import type { GameEntity } from "../types/EngineEntity";

export function createPlayer(ecs: ECSComponents, name: string) {

  const gameEntity: GameEntity = createGameEntity(name, "player");

  const transform = createTransform(gameEntity);
  ecs.addComponent(gameEntity, transform);

  ecs.addComponent<BoxColliderComponent>(gameEntity, {
    instanceId: getId(),
    type: ComponentType.BOX_COLLIDER,
    ignoreSelfCollisions: true,
    size: { x: 32, y: 32 },
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: false
  });

  ecs.addComponent<CircleColliderComponent>(gameEntity, {
    instanceId: getId(),
    enabled: true,
    ignoreSelfCollisions: true,
    radius: 12,
    isTrigger: false,
    offset: {x: 0, y: -8},
    type: ComponentType.CIRCLE_COLLIDER,
    gameEntity: gameEntity,
    collisionGroup: "player"
  })


  ecs.addComponent(gameEntity, {
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

  const spriteRener = createSpriteRender(gameEntity, { scale: 2, layer: 10 });
  ecs.addComponent(gameEntity, spriteRener);

  const animator = createAnimator(gameEntity, PLAYER_CONTROLLER);
  ecs.addComponent<AnimatorComponent>(gameEntity, animator);

  return gameEntity;
}

