import type { Registable } from "../managers/generic-manager";
import { animationClipManager } from "../managers/manager";
import type { AnimationClip } from "./animation";
import type { Component } from "./component";

import type { StateMachine } from "./machine-state";
import type { ParameterMap } from "./state-machine-parameter";

export interface AnimatorComponent extends Component {
  currentClip: AnimationClip | null;
  isPlaying: boolean;
  time: number;
  currentFrameIndex: number;
  playbackSpeed: number; 
}



export interface AnimatorController extends Registable{
  parameters: ParameterMap;
  stateMachine: StateMachine;
}

export function setAnimation(animator: AnimatorComponent, animationClip: AnimationClip) {

  if(animator.currentClip === animationClip) return;
  animator.currentClip = animationClip;
  animator.currentFrameIndex = 0;
  animator.time = 0;
}

export function setAnimationByName(animator: AnimatorComponent, animationClipName: string) {
  const clip = animationClipManager.get(animationClipName);
  if(animator.currentClip === clip) return;
  animator.currentClip = clip;
  animator.currentFrameIndex = 0;
  animator.time = 0;
}
