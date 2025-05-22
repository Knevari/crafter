import type { AnimationClip } from "./animation";
import type { Component } from "./component";

export interface AnimatorComponent extends Component {
  controller: AnimatorController;
  currentClip: AnimationClip | null;
  isPlaying: boolean;
  time: number;
  locked: boolean;
  currentFrameIndex: number;
  playbackSpeed: number;

}


export interface AnimatorState {
  clip: AnimationClip;
  loop: boolean;
}

export interface AnimatorController {
  name: string;
  currentState: string | null;
  states: Record<string, AnimatorState>;
  syncCollider?: boolean; 
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

export function setAnimatorState(animator: AnimatorComponent, newStateName: string, locked: boolean = false) {
  const controller = animator.controller;
  if (!controller) return;
  if (animator.locked) return;
  if (controller.currentState === newStateName) return;

  const newState = controller.states[newStateName];
  if (!newState) {
    console.warn(`AnimatorController: estado "${newStateName}" não encontrado.`);
    return;
  }

  controller.currentState = newStateName;
  animator.currentClip = newState.clip;
  animator.currentFrameIndex = 0;
  animator.time = 0;
  animator.isPlaying = true;
  animator.locked = locked;
}
