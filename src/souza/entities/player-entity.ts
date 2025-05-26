import { engine } from "../../lib/engine";
import type { BaseEntity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import type { BoxColliderComponent } from "../types/collider-box";
import type { CharacterControlerComponent, PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import { PLAYER_CONTROLLER } from "../animator/controllers/player-controller";

export function createPlayer(ecs: ECSComponents, name: string) {

  const entity: BaseEntity = { id: name };

  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, {
    entity: entity,
    x: engine.canvas.width / 2,
    y: engine.canvas.height / 2,
    enabled: true
  });

  ecs.addComponent<BoxColliderComponent>(entity, ComponentType.BoxCollider, {
    entity: entity,
    isStatic: true,
    width: 32,
    height: 40,
    offsetX: 16,
    offsetY: 10,
    enabled: true,
  });

  ecs.addComponent<CharacterControlerComponent>(entity, ComponentType.CharacterControler, {
    enabled: true,
    facing: "side",
    state: "idle",
    direction: { x: 0, y: 0 },
    moving: false,
    speed: 80,
    runSpeed: 100

  });
  
  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    entity: entity,
    color: { r: 255, g: 255, b: 255, a: 1 },
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
    controller: PLAYER_CONTROLLER,
    playbackSpeed: 1.0,
    locked: false,
    currentClip: null,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0
  });

  return entity;
}

