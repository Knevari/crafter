import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import { SLIME_ANIMATOR_CONTROLLER } from "../animator/controllers/slime-controller";
import { createTransform } from "../components/transform";
import type TransformComponent from "../components/transform";
import { createAnimator } from "../builders/createAnimator";
import { getId } from "../builders/createId";
import type { CircleColliderComponent } from "../collider/types/CircleCollider";
import { createGameEntity } from "../builders/createGameEntity";
import type { GameEntity } from "../types/EngineEntity";

export function createSlime(ecs: ECSComponents, name: string) {

  const gameEntity: GameEntity = createGameEntity(name, "slime");

  ecs.addComponent<TransformComponent>(gameEntity, createTransform(gameEntity));

  ecs.addComponent<CircleColliderComponent>(gameEntity, {
    instanceId: getId(),
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: false,
    ignoreSelfCollisions: true,
    radius: 32,
    type: ComponentType.CIRCLE_COLLIDER,
    gameEntity: gameEntity
  });


  ecs.addComponent<SpriteRenderComponent>(gameEntity, {
    instanceId: getId(),
    type: ComponentType.SPRITE_RENDER,
    color: "white",
    sprite: null,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: 0,
    enabled: true,
  });

  ecs.addComponent<AnimatorComponent>(gameEntity, createAnimator(gameEntity, SLIME_ANIMATOR_CONTROLLER));

  return gameEntity;
}

