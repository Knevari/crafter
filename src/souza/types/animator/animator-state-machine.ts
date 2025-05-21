import type { AnimatorState } from "./animator-state";
import type { AnimatorTransition } from "./animator-transition";

export interface AnimatorStateMachine {
  currentState: string;
  stateTime: number;
  states: Record<string, AnimatorState>;
  transitions: AnimatorTransition[];
}

