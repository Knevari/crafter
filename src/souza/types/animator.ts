import type { Component } from "../ecs";
import type { Animations } from "./animation";

export interface AnimatorComponent extends Component {
  controllerEntityId: string; 
  currentAnimation: string;
  currentFrameIndex: number;
  time: number;
  playing: boolean;
  animations: Animations;
}
