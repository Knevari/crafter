import { Result } from "../../managers/result";
import type { AnimationClip } from "../animation/animation.types";
import type { SpriteRenderComponent } from "../render/sprite_render/sprite.render.types";
import type { AnimatorComponent, AnimatorState } from "./animator.types";

function startClip(animator: AnimatorComponent, clip: AnimationClip, lock: boolean) {
  animator.currentClip = clip;
  animator.currentFrameIndex = 0;
  animator.time = 0;
  animator.isPlaying = true;
  animator.locked = lock;
}

export function setAnimation(animator: AnimatorComponent, animationClip: AnimationClip, lock = false) {
  if (animator.currentClip === animationClip || animator.locked) return;
  startClip(animator, animationClip, lock);
}

export function setAnimatorState(animator: AnimatorComponent, newStateName: string, lock: boolean = false) {
  const controller = animator.controller;
  if (!controller || animator.locked || controller.currentState === newStateName) return;

  const newState = controller.states[newStateName];
  if (!newState) {
    console.warn(`AnimatorController: estado "${newStateName}" não encontrado.`);
    return;
  }

  controller.currentState = newStateName;
  startClip(animator, newState.clip, lock);
}


export function advanceFrame(
  animator: AnimatorComponent,
  state: AnimatorState,
  delta: number
) {
  const clip = state.clip;
  if (!clip) return;

  const frameDuration = 1 / clip.frameRate;
  animator.time += delta * animator.playbackSpeed;

  while (animator.time >= frameDuration) {
    animator.time -= frameDuration;
    animator.currentFrameIndex++;

    if (animator.currentFrameIndex >= clip.frames.length) {
      if (state.loop) {
        animator.currentFrameIndex = 0;
      } else {
        animator.currentFrameIndex = clip.frames.length - 1;
        animator.isPlaying = false;
        animator.locked = false;
        break;
      }
    }
  }
}

export function updateSprite(animator: AnimatorComponent, state: AnimatorState, spriteRender: SpriteRenderComponent) {
  const animationClip = state.clip;
  if (!animationClip) return;

  const frameIndex = animator.currentFrameIndex;
  if (frameIndex < 0 || frameIndex >= animationClip.frames.length) return;

  const frame = animationClip.frames[frameIndex];
  spriteRender.sprite = frame.sprite;
}


export function getAnimatorState(animator: AnimatorComponent): Result<AnimatorState> {
  const controller = animator.controller;
  if (!controller) return Result.err("No controller assigned to animator.");

  const stateName = controller.currentState;
  if (!stateName) return Result.err("No current state set in controller.");

  const state = controller.states[stateName];
  if (!state) return Result.err(`State "${stateName}" not found in controller.`);

  return Result.ok(state);
}