import type { Entity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import type { BoxColliderComponent } from "../collider/IBoxCollider";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import { SLIME_ANIMATOR_CONTROLLER } from "../animator/controllers/slime-controller";
import { createTransform } from "../components/transform";
import type TransformComponent from "../components/transform";
import { createAnimator } from "../builders/createAnimator";
import { getId } from "../builders/createId";
import type { CircleColliderComponent } from "../collider/circle-collider";
import { createEntity } from "../builders/createEntity";

export function createSlime(ecs: ECSComponents, name: string) {

  const entity: Entity = createEntity("slime");

  ecs.addComponent<TransformComponent>(entity, createTransform(entity));

  ecs.addComponent<BoxColliderComponent>(entity, {
    instanceId: getId(),
    type: ComponentType.BOX_COLLIDER,
    ignoreSelfCollisions: true,
    width: 32,
    height: 32,
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: false
  });

  ecs.addComponent<CircleColliderComponent>(entity, {
    instanceId: getId(),
    offset: { x: 0, y: 0 },
    enabled: true,
    isTrigger: true,
    ignoreSelfCollisions: true,
    radius: 128,
    type: ComponentType.CIRCLE_COLLIDER,
    entityRef: entity
  })


  ecs.addComponent<SpriteRenderComponent>(entity, {
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

  ecs.addComponent<AnimatorComponent>(entity, createAnimator(entity, SLIME_ANIMATOR_CONTROLLER));

  return entity;
}

