import type { updateAnimator } from "../lib/animation";
import type { AnimatorComponent } from "./types/animator/animator";
import { AnimatorComparison } from "./types/animator/animator-comparison";
import type { AnimatorController } from "./types/animator/animator-controler";
import { AnimatorParameterType } from "./types/animator/animator-parameter-type";


const animations = {
  idleAnim: {
    name: "idleAnim",
    frames: [
      { spriteIndex: 0, duration: 0.2 },
      { spriteIndex: 1, duration: 0.2 },
    ],
    loop: true,
    frameRate: 5,
  },
  walkAnim: {
    name: "walkAnim",
    frames: [
      { spriteIndex: 2, duration: 0.1 },
      { spriteIndex: 3, duration: 0.1 },
      { spriteIndex: 4, duration: 0.1 },
    ],
    loop: true,
    frameRate: 10,
  },
};

const controller: AnimatorController = {
  parameters: {
    bools: { isWalking: false },
    ints: {},
    floats: {},
  },
  stateMachine: {
    currentState: "Idle",
    stateTime: 0,
    states: {
      Idle: { name: "Idle", animation: "idleAnim" },
      Walk: { name: "Walk", animation: "walkAnim" },
    },
    transitions: [
      {
        from: "Idle",
        to: "Walk",
        conditions: [
          {
            parameter: "isWalking",
            type: AnimatorParameterType.BOOL,
            comparison: AnimatorComparison.EQUAL,
            value: true,
          },
        ],
      },
      {
        from: "Walk",
        to: "Idle",
        conditions: [
          {
            parameter: "isWalking",
            type: AnimatorParameterType.BOOL,
            comparison: AnimatorComparison.EQUAL,
            value: false,
          },
        ],
      },
    ],
  },
};

const animator: AnimatorComponent = {
  controller,
  currentAnimation: "idleAnim",
  currentFrameIndex: 0,
  time: 0,
  playing: true,
  animations,
};





