import type { AnimatorStateMachine } from "./animator-state-machine";
import type { AnimatorParameters } from "./animator-parameters";
import type { Component } from "../ecs";

export interface AnimatorControllerComponent extends Component {
  parameters: AnimatorParameters;
  stateMachine: AnimatorStateMachine;
}
