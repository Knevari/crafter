import type { ECSComponents } from "../ecs/ecs-components";
import type { AnimatorComponent } from "../types/animator";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

export default function AnimatorSystem(): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const entities = ecs.queryEntitiesWithComponents(ComponentType.SpriteRender, ComponentType.Animator);
      for (const entity of entities) {
        const animator = ecs.getComponent<AnimatorComponent>(entity, ComponentType.Animator);
        if (!animator) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender);
        if (!spriteRender) continue;
        animator.time += deltaTime * (animator.playbackSpeed ?? 1);
        const animationClip = animator.currentClip;
        if (!animationClip) continue;

        const frameDuration = 1 / animationClip.frameRate;
        if (animator.time >= frameDuration) {
          animator.time -= frameDuration;
          animator.currentFrameIndex++;
          if (animator.currentFrameIndex >= animationClip.frames.length) {
            if (animationClip.loop) {
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
      }
    }
  }
}
