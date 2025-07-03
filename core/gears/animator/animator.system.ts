import { ComponentType } from "../../types/component-type";
import Time from "../../time/time";
import type { System } from "../ecs/system";

import type { AnimatorComponent } from ".";
import type { SpriteRenderComponent } from "../render/sprite_render/sprite.render.types";
import { Animator } from "../../../engine/components";
import type { ECSComponentState } from "../ecs/component";
import { ECS } from "../../../engine/TwoD";

export function AnimatorSystem(componentState: ECSComponentState): System {
  return {
    lateUpdate() {

      const animators = ECS.Component.getComponentsByType<AnimatorComponent>(componentState, ComponentType.Animator);

      for (const animator of animators) {
        if (!animator.enabled || !animator.controller) continue;

        const spriteRender = ECS.Component.getComponent<SpriteRenderComponent>(componentState,animator.gameEntity, ComponentType.SPRITE_RENDER);
        if (!spriteRender) continue;

        const result = Animator.getAnimatorState(animator);

        if (!result.ok) {
          console.warn("Animator state error:", result.error);
          continue;
        }

        const state = result.value;

       Animator.advanceFrame(animator, state, Time.deltaTime);
       Animator.updateSprite(animator, state, spriteRender);

      }
    }
  }
}