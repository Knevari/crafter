import { engine } from "../lib/engine";
import type { BaseEntity } from "../lib/types";
import { PLAYER_ATTACK_DOWN_CLIP, PLAYER_ATTACK_SIDE_CLIP, PLAYER_ATTACK_UP_CLIP, PLAYER_IDLE_DOWN_CLIP, PLAYER_WALK_DOWN_CLIP, PLAYER_WALK_SIDE_CLIP, PLAYER_WALK_UP_CLIP } from "./game/player-animations";
import { SLIME_DEAD_CLIP, SLIME_GREEN_DEAD_CLIP, SLIME_GREEN_IDLE_CLIP, SLIME_GREEN_MOVE_CLIP, SLIME_IDLE_CLIP, SLIME_MOVE_CLIP } from "./game/slime_animations";
import AnimatorSystem from "./systems/animator-system";
import CharacterControllerComponent from "./systems/character-controller-system";
import { ECSComponents } from "./ecs/ecs-components";
import { ECSSystems } from "./ecs/ecs-system";
import FollowSystem from "./systems/follow-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import type { AnimatorComponent, AnimatorController } from "./types/animator";
import type { PositionComponent, CharacterControlerComponent } from "./types/component-position";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import type { Component } from "./types/component";
import { timeDebug } from "../main";
import type { BoxColliderComponent } from "./types/collider-box";
import {createColliderSystem }from "./systems/collider-system";

const ecs = new ECSComponents();
const systems = new ECSSystems(ecs);
systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(createColliderSystem(engine.ctx));
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControllerComponent());


export function callUpdateSouzaSystem(deltaTime: number) {
  systems.update(deltaTime);

  let size = 0;
  ecs.components.forEach(c => { size += c.size });

  timeDebug.textContent =
    `Tempo: ${deltaTime.toFixed(2)} ms\n` +
    `Delta: ${deltaTime.toFixed(3)}\n` +
    `FPS: ${(1 / deltaTime).toFixed(0)}\n` +
    `Entidades: ${size}`;
}


function createPlayer() {
  const playerController: AnimatorController = {
    name: "playerController",
    currentState: "idle",
    states: {
      idle: {
        clip: PLAYER_IDLE_DOWN_CLIP,
        loop: true
      },
      walk_front: {
        clip: PLAYER_WALK_DOWN_CLIP,
        loop: true
      },
      walk_back: {
        clip: PLAYER_WALK_UP_CLIP,
        loop: true
      },
      walk_side: {
        clip: PLAYER_WALK_SIDE_CLIP,
        loop: true
      },
      attack_down: {
        clip: PLAYER_ATTACK_DOWN_CLIP,
        loop: false
      },
      attack_up: {
        clip: PLAYER_ATTACK_UP_CLIP,
        loop: false
      },
      attack_side: {
        clip: PLAYER_ATTACK_SIDE_CLIP,
        loop: false
      },
    }
  };

  const animatedEntity = createAnimatedEntity("player", playerController);

  ecs.addComponent<CharacterControlerComponent>(animatedEntity, ComponentType.CharacterControler, {
    direction: { x: 0, y: 0 },
    lastDirection: "left",
    moving: false,
    speed: 80,

  });


  return animatedEntity;
}

function createEmptyEntity(name: string): BaseEntity {
  const entity: BaseEntity = { id: name };
  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, { x: 0, y: 0, });
  return entity;
}

function createAnimatedEntity(name: string, controller: AnimatorController): BaseEntity {

  const entity = createEmptyEntity(name);

  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    sprite: null,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<AnimatorComponent>(entity, ComponentType.Animator, {
    controller: controller,
    playbackSpeed: 1.0,
    locked: false,
    currentClip: null,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0
  });

    ecs.addComponent<BoxColliderComponent>(entity, ComponentType.BoxCollider, {
    width: 32,
    height: 40,
    offsetX: 16,
    offsetY: 10,
    enabled: true,
  });


  return entity;
}

function createSlime(): BaseEntity {
  const animatorController: AnimatorController = {
    name: "slimeController",
    currentState: "idle",
    syncCollider: true,
    states: {
      idle: {
        clip: SLIME_IDLE_CLIP,
        loop: true,
      },
      move: {
        clip: SLIME_MOVE_CLIP,
        loop: true,
      },
      dead: {
        clip: SLIME_DEAD_CLIP,
        loop: false,
      },
    },
  };
  return createAnimatedEntity("slime", animatorController);
}

function createSlimeGreen(): BaseEntity {
  const animatorController: AnimatorController = {
    name: "slimeGreenController",
    currentState: "idle",
    states: {
      idle: {
        clip: SLIME_GREEN_IDLE_CLIP,
        loop: true,
      },
      move: {
        clip: SLIME_GREEN_MOVE_CLIP,
        loop: true,
      },
      dead: {
        clip: SLIME_GREEN_DEAD_CLIP,
        loop: false,
      },
    },
  };

  return createAnimatedEntity("slimeGreen", animatorController);
}

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

const enemies: BaseEntity[] = [];


export function start() {
  const player = createPlayer();
  const slime = createSlime();
  systems.addSystem(FollowSystem(player, [slime], 40, 200))
  // console.log(JSON.stringify(mapToObjectWithEntityId(ecs.components), null, 2))

}