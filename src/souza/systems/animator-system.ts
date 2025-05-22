import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import type { BoxColliderComponent } from "../types/collider-box";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

export default function AnimatorSystem(): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const animators = ecs.getComponentsByType<AnimatorComponent>(ComponentType.Animator);

      for (const animator of animators) {
        const entity = ecs.getEntityByComponent(animator);
        if (!entity) continue;

        if (!animator) continue;

        const controller = animator.controller;
        if (!controller) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender);
        if (!spriteRender) continue;

        animator.time += deltaTime * (animator.playbackSpeed ?? 1);

        const stateName = controller.currentState;
        if (!stateName) continue;

        const state = controller.states[stateName];
        if (!state) continue;

        const animationClip = state.clip;
        if (!animationClip) continue;

        const frameDuration = 1 / animationClip.frameRate;

        if (animator.time >= frameDuration) {
          animator.time -= frameDuration;
          animator.currentFrameIndex++;

          if (animator.currentFrameIndex >= animationClip.frames.length) {
            if (state.loop) {
              animator.currentFrameIndex = 0;
            } else {
              animator.currentFrameIndex = animationClip.frames.length - 1;
              animator.isPlaying = false;
              animator.locked = false;
            }
          }
        }

        const frame = animationClip.frames[animator.currentFrameIndex];
        spriteRender.sprite = frame.sprite;

        const collider = ecs.getComponent<BoxColliderComponent>(entity, ComponentType.BoxCollider);
        if (collider && animator.controller.syncCollider) {
          const clipCollider = animationClip.frames[animator.currentFrameIndex].collider;
          if (clipCollider) {
            collider.offsetX = clipCollider.offsetX;
            collider.offsetY = clipCollider.offsetY;
            collider.width = clipCollider.width;
            collider.height = clipCollider.height;
            collider.enabled = true;
          }
        }

      }
    }
  }
}

