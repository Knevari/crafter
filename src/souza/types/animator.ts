import type { Animations } from "./animation";
import type { Component } from "./component";
import type { StateMachine } from "./machine-state";
import type { ParameterMap } from "./state-machine-parameter";

export interface AnimatorComponent extends Component {
  controllerId: string;
  currentAnimation: string;
  currentFrameIndex: number;
  time: number;
  playing: boolean;
  animations: Animations;
}

export interface AnimatorController {
  id: string;
  parameters: ParameterMap;
  stateMachine: StateMachine;
}
