import { engine } from "../lib/engine";
import type { BaseEntity } from "../lib/types";
import { timeDebug } from "../main";
import { ECSComponents } from "./ecs/ecs-components";
import { PLAYER_IDLE_DOWN_CLIP, PLAYER_WALK_DOWN_CLIP, PLAYER_WALK_UP_CLIP, PLAYER_WALK_SIDE_CLIP, PLAYER_ATTACK_DOWN_CLIP, PLAYER_ATTACK_UP_CLIP, PLAYER_ATTACK_SIDE_CLIP } from "./animations/player-animations";
import { SLIME_IDLE_CLIP, SLIME_MOVE_CLIP, SLIME_DEAD_CLIP, SLIME_GREEN_IDLE_CLIP, SLIME_GREEN_MOVE_CLIP, SLIME_GREEN_DEAD_CLIP } from "./animations/slime_animations";
import Input from "./input/Input";
import PCG32 from "./perlin-noise/PCG32";
import { PerlinNoise2D } from "./perlin-noise/perlin-noise-2d";
import { generateTerrain, generateTrees } from "./perlin-noise/terrain";
import AnimatorSystem from "./systems/animator-system";
import { cameraSystem } from "./systems/camera-system";
import CharacterControllerComponent from "./systems/character-controller-system";
import { createColliderSystem } from "./systems/box-collider-system";
import FollowSystem from "./systems/follow-system";
import SpriteRenderSystem from "./systems/sprite-render-system";
import Time from "./systems/time";
import type { AnimatorController, AnimatorComponent } from "./types/animator";
import type { CameraComponent } from "./types/camera";
import type { BoxColliderComponent } from "./types/collider-box";
import type { Component } from "./types/component";
import type { CharacterControlerComponent, PositionComponent } from "./types/component-position";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import { ECSSystems } from "./ecs/ecs-system";
import { TREE_SPRITE } from "./sprites/tree-sprite";
import { GROUND_SPRITE } from "./sprites/ground-sprite";
import { WATER_SPRITE } from "./sprites/water-sprite";
import type { Sprite } from "./types/sprite";

export const ecs = new ECSComponents();
export const systems = new ECSSystems(ecs);



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

  const entity = createAnimatedEntity("player", playerController, 1);

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
    direction: { x: 0, y: 0 },
    lastDirection: "left",
    moving: false,
    speed: 80,

  });


  return entity;
}

function createEmptyEntity(name: string): BaseEntity {
  const entity: BaseEntity = { id: name };
  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, { entity: entity, x: engine.canvas.width / 2, y: engine.canvas.height / 2, enabled: true });
  return entity;
}

function createAnimatedEntity(name: string, controller: AnimatorController, layer: number = 0): BaseEntity {

  const entity = createEmptyEntity(name);

  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    entity: entity,
     color: {r: 255, g: 255, b: 255, a: 1},
    sprite: TREE_SPRITE,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: layer,
    enabled: true,
  });

  ecs.addComponent<AnimatorComponent>(entity, ComponentType.Animator, {
    entity: entity,
    enabled: true,
    controller: controller,
    playbackSpeed: 1.0,
    locked: false,
    currentClip: null,
    isPlaying: true,
    currentFrameIndex: 0,
    time: 0
  });


  return entity;
}

export function createRenderableEntity(name: string, sprite: Sprite, position: PositionComponent, layer: number) {
  const entity: BaseEntity = { id: name };

  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, position);
  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    entity: entity,
    enabled: true,
    sprite: sprite,
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: layer
  });
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

  const entity = createAnimatedEntity("slime", animatorController);

  ecs.addComponent<BoxColliderComponent>(entity, ComponentType.BoxCollider, {
    entity: entity,
    isStatic: true,
    width: 32,
    height: 40,
    offsetX: 16,
    offsetY: 10,
    enabled: true,
  });

  return entity;
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


const camera: CameraComponent = {
  enabled: true,
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0,
};

ecs.addSingleton<CameraComponent>(ComponentType.Camera, camera);

const seed = new PCG32(1234567890123456789n, 9876543210987654321n);
const perlin = new PerlinNoise2D(seed);

const seed2 = new PCG32(123456789045647456789n, 9876543210987654321n);
const perlin2 = new PerlinNoise2D(seed2);


const width = 32;
const height = 32;
const persistence = 0.2;
const octaves = 6;
const scale = 16;
const terrainMatrix = generateTerrain(perlin, width, height, octaves, persistence, scale);


// generateTrees(terrain, perlin2, 32, 32, 6, 1.0);

const player = createPlayer();
const slime = createSlime();

systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(createColliderSystem());
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControllerComponent());
systems.addSystem(createColliderSystem())

// systems.addSystem(FollowSystem(player, [slime], 40, 200));
systems.addSystem(cameraSystem(engine.ctx, player));

export function app() {

  const time = new Time();

  time.on("start", () => {
    Input.start();

  });

  time.on("fixedUpdate", () => {
    systems.callFixedUpdate();
  });
  time.on("lateUpdate", () => {
    systems.callLatedUpdate();

  });

  time.on("render", () => {
    engine.ctx.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
    systems.callRender();
    systems.callDrawGizmos();

  });

  time.on("update", () => {
    systems.callUpdate(Time.deltaTime);
    Input.clearInputs();
  });

  time.start();
}



function getSprite(value: number): Sprite {

  if(value < 0.052) {
    return WATER_SPRITE;
  }

   if(value < 0.6) {
    return GROUND_SPRITE;
  }

  return GROUND_SPRITE;
 
}

export function renderTerrainBase(
  terrain: number[][],
  scale: number
) {
  const height = terrain.length;
  const width = terrain[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = terrain[y][x];
      const screenX = x * scale;
      const screenY = y * scale;

      const entity: BaseEntity = { id: `ground_${x}_${y}` };
      ecs.addComponent<PositionComponent>(entity, ComponentType.Position, { entity: entity, x: screenX, y: screenY, enabled: true });

      ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
        entity: entity,
        color: {r: value * 255, g: value * 255, b: value * 255, a: 1},
        sprite: null,
        scale: scale,
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
        layer: -1,
        enabled: true,
      });
    }
  }
}

renderTerrainBase(terrainMatrix, scale);