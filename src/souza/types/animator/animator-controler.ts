import type { AnimatorStateMachine } from "./animator-state-machine";
import type { AnimatorParameters } from "./animator-parameters";

export interface AnimatorController {
  parameters: AnimatorParameters;
  stateMachine: AnimatorStateMachine;
}
