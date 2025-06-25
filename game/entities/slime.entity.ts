import { ComponentType } from "../../core/types/component-type";
import type { SpriteRenderComponent } from "../../core/gears/render/sprite_render/sprite.render.types";
import { SLIME_ANIMATOR_CONTROLLER } from "../controllers/slime.animator.controller";
import { createTransform } from "../../core/gears/transform/transform.types";
import type TransformComponent from "../../core/gears/transform/transform.types";
import { createAnimator } from "../../core/builders/createAnimator";
import { getId } from "../../core/builders/createId";
import type { CircleColliderComponent } from "../../core/collider/types/CircleCollider";
import { createGameEntity } from "../../core/builders/createGameEntity";
import type { GameEntity } from "../../core/types/EngineEntity";
import type { AnimatorComponent } from "../../core/gears/animator";
import type { ECSComponentState } from "../../core/gears/ecs/component";
import { ECS } from "../../engine/TwoD";


export function createSlime(componentState: ECSComponentState, name: string) {
  const gameEntity: GameEntity = createGameEntity(name, "enemy");

  ECS.Component.addComponent<TransformComponent>(componentState, gameEntity, createTransform(gameEntity));


  ECS.Component.addComponent<CircleColliderComponent>(componentState, gameEntity, {
    instanceId: getId(),
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: true,
    ignoreSelfCollisions: true,
    radius: 150,
    type: ComponentType.CIRCLE_COLLIDER,
    category: ComponentType.COLLIDER,
    gameEntity: gameEntity,
  });


  ECS.Component.addComponent<CircleColliderComponent>(componentState, gameEntity, {
    instanceId: getId(),
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: true,
    ignoreSelfCollisions: true,
    radius: 32,
    type: ComponentType.CIRCLE_COLLIDER,
    category: ComponentType.COLLIDER,
    gameEntity: gameEntity,
  });

  ECS.Component.addComponent<SpriteRenderComponent>(componentState, gameEntity, {
    gameEntity: gameEntity,
    instanceId: getId(),
    type: ComponentType.SPRITE_RENDER,
    category: ComponentType.SPRITE_RENDER,
    color: "white",
    sprite: null,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: 0,
    enabled: true,
  });

  ECS.Component.addComponent<AnimatorComponent>(
    componentState,
    gameEntity,
    createAnimator(gameEntity, SLIME_ANIMATOR_CONTROLLER),
  );

  return gameEntity;
}
