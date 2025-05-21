import ECSComponents, { ComponentType } from "../ecs";
import type { AnimatorComponent } from "../types/animator";
import type { AnimatorControllerComponent } from "../types/animator-controler";
import type { System } from "./system";

export default function AnimatorSystem(): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const animators = ecs.getComponentsByType<AnimatorComponent>(ComponentType.Animator);

      for (const animator of animators) {
        if (!animator.playing) continue;

        const controller = ecs.getComponent<AnimatorControllerComponent>(
          { id: animator.controllerEntityId },
          ComponentType.Controller
        );
        if (!controller) continue;

        const currentState = controller.stateMachine.states[controller.stateMachine.currentState];
        const animation = animator.animations[currentState.animation];
        animator.time += deltaTime;

        const frame = animation.frames[animator.currentFrameIndex];
        if (animator.time >= (frame.duration ?? 0)) {
          animator.time = 0;
          animator.currentFrameIndex = (animator.currentFrameIndex + 1) % animation.frames.length;
        }
      }
    }
  }

};

