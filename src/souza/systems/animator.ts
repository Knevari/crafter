import type { AnimatorComponent } from "../types/animator/animator";
import { checkTransitionConditions } from "./transition-conditions";

export function updateAnimator(animator: AnimatorComponent, deltaTime: number) {
  const controller = animator.controller;
  const stateMachine = controller.stateMachine;
  const parameters = controller.parameters;

  stateMachine.stateTime += deltaTime;
  animator.time += deltaTime;

  for (const transition of stateMachine.transitions) {
    if (
      transition.from === stateMachine.currentState &&
      checkTransitionConditions(transition.conditions, parameters)
    ) {
      stateMachine.currentState = transition.to;
      stateMachine.stateTime = 0;

      const newState = stateMachine.states[transition.to];
      animator.currentAnimation = newState.animation;
      animator.currentFrameIndex = 0;
      animator.time = 0;

      break;
    }
  }
}
