import type { Registable } from "../managers/generic-manager";
import type { Component } from "./component";
import type { StateMachine } from "./machine-state";
import type { ParameterMap } from "./state-machine-parameter";

export interface AnimatorComponent extends Component {
  controllerId: string;
  currentAnimation: string;
  currentFrameIndex: number;
  time: number;
  playing: boolean;
}

export interface AnimatorController extends Registable{
  parameters: ParameterMap;
  stateMachine: StateMachine;
}
