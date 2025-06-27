import { ComponentType } from "../../core/types/component-type";
import type { SpriteRenderComponent } from "../../core/gears/render/sprite_render/sprite.render.types";
import { SLIME_ANIMATOR_CONTROLLER } from "../controllers/slime.animator.controller";
import type TransformComponent from "../../core/gears/transform/transform.types";
import { createIncrementalId } from "../../core/builders/create.incremental.id";
import type { CircleColliderComponent } from "../../core/collider/types/CircleCollider";
import { createGameEntity } from "../../core/builders/create.game.entity";
import type { GameEntity } from "../../core/types/EngineEntity";
import type { AnimatorComponent } from "../../core/gears/animator";
import type { ECSComponentState } from "../../core/gears/ecs/component";
import { ECS } from "../../engine/TwoD";
import { createTransformComponent } from "../../engine/builders";

export function createSlime(componentState: ECSComponentState, name: string) {
  const gameEntity: GameEntity = createGameEntity(name, "enemy");

  ECS.Component.addComponent<TransformComponent>(componentState, gameEntity, createTransformComponent(gameEntity));

  ECS.Component.addComponent<CircleColliderComponent>(componentState, gameEntity, {
    instanceId: createIncrementalId(),
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
    instanceId: createIncrementalId(),
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
    instanceId: createIncrementalId(),
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

  ECS.Component.addComponent<AnimatorComponent>(componentState, gameEntity, {
    instanceId: createIncrementalId(),
    category: ComponentType.ANIMATOR,
    controller: SLIME_ANIMATOR_CONTROLLER,
    currentClip: null,
    currentFrameIndex: 0,
    enabled: true,
    gameEntity: gameEntity,
    isPlaying: false,
    locked: false,
    playbackSpeed: 1,
    time: 0,
    type: ComponentType.ANIMATOR


  });

  return gameEntity;

}