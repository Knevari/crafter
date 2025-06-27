import type { Component, ComponentOptions } from "../component/component";
import type { AnimationClip } from "../animation";

export interface AnimatorComponent extends Component {
  controller: AnimatorController | null;
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

export type AnimatorOptions = ComponentOptions<AnimatorComponent>;