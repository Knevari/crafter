import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent, AnimatorState } from "../types/animator";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";
import Time from "../time/time";

export type Result<T, E = string> = | { ok: true; value: T } | { ok: false; error: E };

export default function AnimatorSystem(): System {
  return {
    latedUpdate(ecs: ECSComponents) {

      const animators = ecs.getComponentsByType<AnimatorComponent>(ComponentType.ANIMATOR);

      for (const animator of animators) {
        if (!animator.enabled || !animator.controller) continue;

        const entity = ecs.getEntityByComponent(animator);
        if (!entity) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(entity, ComponentType.SPRITE_RENDER);
        if (!spriteRender) continue;


        const result = getAnimatorState(animator);

        if (!result.ok) {
          console.warn("Animator state error:", result.error);
          continue;
        }

        const state = result.value;

        advanceFrame(animator, state, Time.deltaTime);
        updateSprite(animator, state, spriteRender);
      
      }
    }
  }
}

function advanceFrame(
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

function updateSprite(animator: AnimatorComponent, state: AnimatorState, spriteRender: SpriteRenderComponent) {
  const animationClip = state.clip;
  if (!animationClip) return;

  const frameIndex = animator.currentFrameIndex;
  if (frameIndex < 0 || frameIndex >= animationClip.frames.length) return;

  const frame = animationClip.frames[frameIndex];
  spriteRender.sprite = frame.sprite;
}


function getAnimatorState(animator: AnimatorComponent): Result<AnimatorState> {
  const controller = animator.controller;
  if (!controller) return { ok: false, error: "No controller assigned to animator." };

  const stateName = controller.currentState;
  if (!stateName) return { ok: false, error: "No current state set in controller." };

  const state = controller.states[stateName];
  if (!state) return { ok: false, error: `State "${stateName}" not found in controller.` };

  return { ok: true, value: state };
}










// const collider = ecs.getComponent<BoxColliderComponent>(entity, ComponentType.BOX_COLLIDER);
// if (collider && animator.controller.syncCollider) {
//   const clipCollider = animationClip.frames[animator.currentFrameIndex].collider;
//   if (clipCollider) {
//     collider.offsetX = clipCollider.offsetX;
//     collider.offsetY = clipCollider.offsetY;
//     collider.width = clipCollider.width;
//     collider.height = clipCollider.height;
//     collider.enabled = true;
//   }
// }