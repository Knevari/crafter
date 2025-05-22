import { type BaseEntity } from "../lib/types";
import type { CharacterControlerComponent, PositionComponent } from "./types/component-position";
import { ECSComponents } from "./systems/ecs-components";
import { ECSSystems } from "./systems/ecs-system";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import { type SpriteSheet } from "./types/sprite-sheet";
import SpriteRenderSystem from "./systems/sprite-render-system";
import type { AnimationClip } from "./types/animation";
import type { AnimatorComponent, AnimatorController } from "./types/animator";
import { ParameterType, type ParameterMap } from "./types/state-machine-parameter";
import type { StateMachine, StateMap } from "./types/machine-state";
import AnimatorSystem from "./systems/animator-system";
import { engine } from "../lib/engine";
import { animationClipManager, animatorControllerManager, spriteSheetManager } from "./managers/manager";
import CharacterControllerComponent from "./managers/character-controller-system";

const ecs = new ECSComponents();
const systems = new ECSSystems(ecs);
systems.addSystem(SpriteRenderSystem(engine.ctx));
systems.addSystem(AnimatorSystem())
systems.addSystem(CharacterControllerComponent())


export function callUpdateSouzaSystem(deltaTime: number) {
  systems.update(deltaTime);
}
const playerSpriteSheet: SpriteSheet = {
  itemId: "player",
  imageRef: "player_img",
  sprites: {
    idle_0: { x: 0, y: 0, width: 32, height: 32 },
    idle_1: { x: 32, y: 0, width: 32, height: 32 },
    idle_2: { x: 64, y: 0, width: 32, height: 32 },
    idle_3: { x: 96, y: 0, width: 32, height: 32 },
    idle_4: { x: 128, y: 0, width: 32, height: 32 },
    idle_5: { x: 160, y: 0, width: 32, height: 32 },

    walk_front_0: { x: 0, y: 160, width: 32, height: 32 },
    walk_front_1: { x: 32, y: 160, width: 32, height: 32 },
    walk_front_2: { x: 64, y: 160, width: 32, height: 32 },
    walk_front_3: { x: 96, y: 160, width: 32, height: 32 },
    walk_front_4: { x: 128, y: 160, width: 32, height: 32 },
    walk_front_5: { x: 160, y: 160, width: 32, height: 32 },

    walk_back_0: { x: 0, y: 96, width: 32, height: 32 },
    walk_back_1: { x: 32, y: 96, width: 32, height: 32 },
    walk_back_2: { x: 64, y: 96, width: 32, height: 32 },
    walk_back_3: { x: 96, y: 96, width: 32, height: 32 },
    walk_back_4: { x: 128, y: 96, width: 32, height: 32 },
    walk_back_5: { x: 160, y: 96, width: 32, height: 32 },

    walk_side_0: { x: 0, y: 128, width: 32, height: 32 },
    walk_side_1: { x: 32, y: 128, width: 32, height: 32 },
    walk_side_2: { x: 64, y: 128, width: 32, height: 32 },
    walk_side_3: { x: 96, y: 128, width: 32, height: 32 },
    walk_side_4: { x: 128, y: 128, width: 32, height: 32 },
    walk_side_5: { x: 160, y: 128, width: 32, height: 32 },
  }
};

spriteSheetManager.register(playerSpriteSheet);

// Animation Clips
const idleClip: AnimationClip = {
  itemId: "idle",
  loop: true,
  frameRate: 12,
  frames: [
    { spriteRef: "idle_0" },
    { spriteRef: "idle_1" },
    { spriteRef: "idle_2" },
    { spriteRef: "idle_3" },
    { spriteRef: "idle_4" },
    { spriteRef: "idle_5" },
  ],
};

const walk_backClip: AnimationClip = {
  itemId: "walk_back",
  loop: true,
  frameRate: 12,
  frames: [
    { spriteRef: "walk_back_0" },
    { spriteRef: "walk_back_1" },
    { spriteRef: "walk_back_2" },
    { spriteRef: "walk_back_3" },
    { spriteRef: "walk_back_4" },
    { spriteRef: "walk_back_5" },
  ],
};

const walk_frontClip: AnimationClip = {
  itemId: "walk_front",
  loop: true,
  frameRate: 12,
  frames: [
    { spriteRef: "walk_front_0" },
    { spriteRef: "walk_front_1" },
    { spriteRef: "walk_front_2" },
    { spriteRef: "walk_front_3" },
    { spriteRef: "walk_front_4" },
    { spriteRef: "walk_front_5" },
  ],
};

const walk_sideClip: AnimationClip = {
  itemId: "walk_side",
  loop: true,
  frameRate: 12,
  frames: [
    { spriteRef: "walk_side_0" },
    { spriteRef: "walk_side_1" },
    { spriteRef: "walk_side_2" },
    { spriteRef: "walk_side_3" },
    { spriteRef: "walk_side_4" },
    { spriteRef: "walk_side_5" },
  ],
};

animationClipManager.register(idleClip);
animationClipManager.register(walk_backClip);
animationClipManager.register(walk_frontClip);
animationClipManager.register(walk_sideClip);

const animator: AnimatorComponent = {
  controllerId: "playerController",
  currentAnimation: "idle",
  currentFrameIndex: 0,
  time: 0,
  playing: true,
};


export function callSouzaSystem(entity: BaseEntity) {

  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    spriteSheetId: "player",
    spriteRef: "idle_0",
    scale: 1.5,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, {
    x: 0,
    y: 0,
  });

  ecs.addComponent<CharacterControlerComponent>(entity, ComponentType.CharacterControler, {
    direction: {x: 0, y: 0},
    facing: "left",
    moving: false,
    speed: 2,
    
  })

  const parameters: ParameterMap = {
    isRunning: { type: ParameterType.BOOL, value: true },
    speed: { type: ParameterType.FLOAT, value: 3.5 },
  };


  const states: StateMap = {
    idle: { name: "idle", loop: true }
  };

  const stateMachine: StateMachine = {
    currentState: "idle",
    stateTime: 0,
    states,
    transitions: []
  };

  const animatorController: AnimatorController = {
    itemId: "playerController",
    parameters,
    stateMachine
  };
  animatorControllerManager.register(animatorController);
  ecs.addComponent<AnimatorComponent>(entity, ComponentType.Animator, animator);
}