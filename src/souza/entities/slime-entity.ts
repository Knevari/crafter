import { engine } from "../../lib/engine";
import type { BaseEntity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import type { BoxColliderComponent } from "../types/collider-box";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import { SLIME_ANIMATOR_CONTROLLER } from "../animator/controllers/slime-controller";

export function createSlime(ecs: ECSComponents, name: string) {

  const entity: BaseEntity = { id: name };

  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, {
    entity: entity,
    x: engine.canvas.width / 2,
    y: engine.canvas.height / 2,
    enabled: true
  });

  ecs.addComponent<BoxColliderComponent>(entity, ComponentType.BoxCollider, {
    entity: entity,
    width: 32,
    height: 40,
    offsetX: 16,
    offsetY: 10,
    enabled: true,
    trigger: true
  });

  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    entity: entity,
    color: "white",
    sprite: null,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: 0,
    enabled: true,
  });

  ecs.addComponent<AnimatorComponent>(entity, ComponentType.Animator, {
    entity: entity,
    enabled: true,
    controller: SLIME_ANIMATOR_CONTROLLER,
    playbackSpeed: 1.0,
    locked: false,
    currentClip: null,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0
  });

  return entity;
}

