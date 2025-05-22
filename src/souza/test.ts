import { engine } from "../lib/engine";
import type { BaseEntity } from "../lib/types";
import { PLAYER_IDLE_DOWN_CLIP } from "./game/player-animations";
import { SLIME_IDLE_CLIP, SLIME_MOVE_CLIP } from "./game/slime_animations";
import AnimatorSystem from "./systems/animator-system";
import CharacterControllerComponent from "./systems/character-controller-system";
import { ECSComponents } from "./systems/ecs-components";
import { ECSSystems } from "./systems/ecs-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import type { AnimatorComponent } from "./types/animator";
import type { Component } from "./types/component";
import type { PositionComponent, CharacterControlerComponent } from "./types/component-position";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import type { System } from "./types/system";


const playerEntity: BaseEntity = {id: "player"}
 const slimeEntity: BaseEntity = {id: "slime"}

const ecs = new ECSComponents();
const systems = new ECSSystems(ecs);
systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControllerComponent())
systems.addSystem(SlimeFollowSystem(playerEntity, [slimeEntity], 40))




export default function SlimeFollowSystem(
  playerId: BaseEntity,
  slimeIds: BaseEntity[],
  speed: number,
  followRange: number = 300, 
  stopRange: number = 10  
): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const playerPos = ecs.getComponent<PositionComponent>(playerId, ComponentType.Position);
      if (!playerPos) return;

      for (const slimeId of slimeIds) {
        const slimePos = ecs.getComponent<PositionComponent>(slimeId, ComponentType.Position);
        if (!slimePos) continue;

        const animator = ecs.getComponent<AnimatorComponent>(slimeId, ComponentType.Animator);
        if (!animator) continue;

        const dx = playerPos.x - slimePos.x;
        const dy = playerPos.y - slimePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= followRange && dist > stopRange) {
          // Mover o slime em direção ao player
          const nx = dx / dist;
          const ny = dy / dist;

          slimePos.x += nx * speed * deltaTime;
          slimePos.y += ny * speed * deltaTime;

          if (animator.currentClip !== SLIME_MOVE_CLIP) {
            animator.currentClip = SLIME_MOVE_CLIP;
            animator.currentFrameIndex = 0;
            animator.time = 0;
            animator.isPlaying = true;
          }
        } else {
 
          if (animator.currentClip !== SLIME_IDLE_CLIP) {
            animator.currentClip = SLIME_IDLE_CLIP;
            animator.currentFrameIndex = 0;
            animator.time = 0;
            animator.isPlaying = true;
          }
        }
      }
    },
  };
}

export function callUpdateSouzaSystem(deltaTime: number) {
  systems.update(deltaTime);
}

function createPlayer() {
   

  ecs.addComponent<SpriteRenderComponent>(playerEntity, ComponentType.SpriteRender, {
    sprite: PLAYER_IDLE_DOWN_CLIP.frames[0].sprite,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<PositionComponent>(playerEntity, ComponentType.Position, {
    x: 0,
    y: 0,
  });

  ecs.addComponent<CharacterControlerComponent>(playerEntity, ComponentType.CharacterControler, {
    direction: { x: 0, y: 0 },
    lastDirection: "left",
    moving: false,
    speed:  80,

  });

  ecs.addComponent<AnimatorComponent>(playerEntity, ComponentType.Animator, {
    playbackSpeed: 1.0,
    locked: false,
    currentClip: PLAYER_IDLE_DOWN_CLIP,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0


  });
}

function createSlime() {

  ecs.addComponent<SpriteRenderComponent>(slimeEntity, ComponentType.SpriteRender, {
    sprite: SLIME_IDLE_CLIP.frames[0].sprite,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<PositionComponent>(slimeEntity, ComponentType.Position, {
    x: 0,
    y: 0,
  });

  ecs.addComponent<AnimatorComponent>(slimeEntity, ComponentType.Animator, {
    playbackSpeed: 1.0,
    locked: false,
    currentClip: SLIME_IDLE_CLIP,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0


  });
  
function mapToObjectWithEntityId(
  map: Map<string, Map<BaseEntity, Component>>
): any {
  const obj: any = {};

  for (const [componentName, entitiesMap] of map) {
    obj[componentName] = {};
    for (const [entity, component] of entitiesMap) {
      const entityId = (entity as any).id ?? entity.toString();
      obj[componentName][entityId] = component;
    }
  }

  return obj;
}

console.log(JSON.stringify(mapToObjectWithEntityId(ecs.components), null, 2));







}
export function start() {
  createPlayer();
  createSlime()
}



