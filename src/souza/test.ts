import { type BaseEntity } from "../lib/types";
import type { PositionComponent } from "./types/component-position";
import CharacterMovementSystem from "./systems/character-movement-system";
import { ctx } from "../lib/engine";
import { ECSComponents } from "./ecs-components";
import { ECSSystems } from "./ecs-system";
import { ComponentType } from "./types/component-type";
import type { SpriteRenderComponent } from "./types/sprite-render-component";
import { getSpriteForFrame, type SpriteMap, type SpriteSheet } from "./types/sprite-sheet";
import { spriteSheetManager } from "./managers/sprite-sheet-manager";
import SpriteRenderSystem from "./systems/sprite-render-system";
import type { Animations } from "./types/animation";
import type { AnimatorComponent, AnimatorController } from "./types/animator";
import { ParameterType, type ParameterMap } from "./types/state-machine-parameter";
import type { StateMachine, StateMap, stateMachineTransition } from "./types/machine-state";
import { animatorControllerManager } from "./managers/animator-controler-manager";
import AnimatorSystem from "./systems/animator-system";


const ecs = new ECSComponents();
const systems = new ECSSystems(ecs);
systems.addSystem(CharacterMovementSystem());
systems.addSystem(SpriteRenderSystem(ctx));
systems.addSystem(AnimatorSystem())


export function callUpdateSouzaSystem(deltaTime: number) {
  systems.update(deltaTime);
}
  const playerSpriteSheet: SpriteSheet = {
    id: "player",
    imageId: "player_img",
    sprites: {
      idle_0: { x: 0, y: 0, width: 32, height: 32 },
      idle_1: { x: 32, y: 0, width: 32, height: 32 },
      idle_2: { x: 64, y: 0, width: 32, height: 32 },
      idle_3: { x: 96, y: 0, width: 32, height: 32 },
      idle_4: { x: 128, y: 0, width: 32, height: 32 },
      idle_5: { x: 160, y: 0, width: 32, height: 32 },
    }
  };

  spriteSheetManager.register(playerSpriteSheet);

  const playerAnimations: Animations = {
    idle: {
      loop: true,
      frameRate: 10,
      frames: [
        { spriteName: "idle_0" },
        { spriteName: "idle_1" },
        { spriteName: "idle_2" },
        { spriteName: "idle_3" },
        { spriteName: "idle_4" },
        { spriteName: "idle_5" },
      ],
    }
  };

  const animator: AnimatorComponent = {
    controllerId: "playerController",
    currentAnimation: "idle",
    currentFrameIndex: 0,
    time: 0,
    playing: true,
    animations: playerAnimations
  };


export function callSouzaSystem(entity: BaseEntity) {


  //------------------------------------------------------------



  //------------------------------------------------------------


  ecs.addComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender, {
    spriteSheetId: "player",
    spriteName: "idle_0",
    scale: 2,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  ecs.addComponent<PositionComponent>(entity, ComponentType.Position, {
    x: 0,
    y: 0,
  });

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
    id: "playerController",
    parameters,
    stateMachine
  };
  animatorControllerManager.register(animatorController);


  ecs.addComponent<AnimatorComponent>(entity, ComponentType.Animator, animator);
}


const spriteSheet = spriteSheetManager.get("player");
const sprite = getSpriteForFrame(spriteSheet, playerAnimations, "idle", animator.currentFrameIndex);

console.log(sprite)