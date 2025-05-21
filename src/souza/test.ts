import type { SpriteAnimation, AnimatorComponent } from "./animation";
import { type AnimatorState, type AnimatorTransition, AnimatorComparison, type AnimatorStateMachineComponent } from "./state-machine";
import { AnimatorParameterType, type AnimatorParametersComponent } from "./types/animator-parameters";


const animations: Record<string, SpriteAnimation> = {
  idleAnim: {
    name: 'idleAnim',
    frames: [
      { spriteIndex: 0, duration: 0.2 },
      { spriteIndex: 1, duration: 0.2 },
    ],
    loop: true,
    frameRate: 5,
  },
  walkAnim: {
    name: 'walkAnim',
    frames: [
      { spriteIndex: 2, duration: 0.1 },
      { spriteIndex: 3, duration: 0.1 },
      { spriteIndex: 4, duration: 0.1 },
    ],
    loop: true,
    frameRate: 10,
  },
};

const idleState: AnimatorState = {
  name: 'Idle',
  animation: 'idleAnim',
  loop: true,
};

const walkState: AnimatorState = {
  name: 'Walk',
  animation: 'walkAnim',
  loop: true,
};

const transitions: AnimatorTransition[] = [
  {
    from: 'Idle',
    to: 'Walk',
    conditions: [
      {
        parameter: 'isWalking',
        type: AnimatorParameterType.BOOL,
        comparison: AnimatorComparison.EQUAL,
        value: true,
      },
    ],
  },
  {
    from: 'Walk',
    to: 'Idle',
    conditions: [
      {
        parameter: 'isWalking',
        type: AnimatorParameterType.BOOL,
        comparison: AnimatorComparison.EQUAL,
        value: false,
      },
    ],
  },
];

const stateMachine: AnimatorStateMachineComponent = {
  currentState: 'Idle',
  stateTime: 0,
  states: {
    Idle: idleState,
    Walk: walkState,
  },
  transitions,
};

const parameters: AnimatorParametersComponent = {
  bools: { isWalking: false },
  floats: {},
  ints: {},
};


const animator: AnimatorComponent = {
  currentAnimation: 'idleAnim',
  currentFrameIndex: 0,
  time: 0,
  playing: true,
  animations,
};
