import type { Registable } from "../managers/generic-manager";
import type { AnimationClip } from "./animation";
import type { Component } from "./component";

import type { StateMachine } from "./machine-state";
import type { ParameterMap } from "./state-machine-parameter";

export interface AnimatorComponent extends Component {
  currentClip: AnimationClip | null;
  isPlaying: boolean;
  time: number;
  locked: boolean;
  currentFrameIndex: number;
  playbackSpeed: number; 
}

export interface AnimatorController extends Registable{
  parameters: ParameterMap;
  stateMachine: StateMachine;
}

export function setAnimation(animator: AnimatorComponent, animationClip: AnimationClip, lock = false) {
  if (animator.currentClip === animationClip) return;
  if (animator.locked) return;
  animator.currentClip = animationClip;
  animator.currentFrameIndex = 0;
  animator.time = 0;
  animator.isPlaying = true; 
  animator.locked = lock;
}