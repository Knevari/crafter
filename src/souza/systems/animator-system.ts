import type { ECSComponents } from "../ecs-components";
import { animatorControllerManager } from "../managers/animator-controler-manager";
import { spriteSheetManager } from "../managers/sprite-sheet-manager";
import type { AnimatorComponent, AnimatorController } from "../types/animator";
import { ComponentType } from "../types/component-type";
import type { System } from "./system";

export default function AnimatorSystem(): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const animators = ecs.getComponentsByType<AnimatorComponent>(ComponentType.Animator);

      for (const animator of animators) {
        const controler = animatorControllerManager.get(animator.controllerId);
        if (!controler) continue;

        const animations = animator.animations;
        const currentAnim = animations[animator.currentAnimation];
        if (!currentAnim) continue;

  

      }

    }
  }
};

