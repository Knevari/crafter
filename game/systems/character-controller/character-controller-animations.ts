import { Components, ECS, Input, Types, Enums } from "../../../engine/TwoD";
import type { CharacterControlerComponent } from "./character.controller.types";
import { globalKeyState } from "../../input/input.system";

export default function CharacterControllerAnimationSystem(componentState: Types.ECSComponentState): Types.System {
  return {
    lateUpdate() {

      const characterControlers = ECS.Component.getComponentsByType<CharacterControlerComponent>(componentState, "CHARACTER_CONTROLLER");

      for (const characterControler of characterControlers) {

        const animator = ECS.Component.getComponent<Types.AnimatorComponent>(componentState, characterControler.gameEntity, Enums.ComponentType.Animator);
        if (!animator) continue;

        animator.playbackSpeed = Input.getKey(globalKeyState, Input.KeyCode.ShiftLeft) ? 1.5 : 1.0;

        const dir = characterControler.direction;

        if (dir.x !== 0 || dir.y !== 0) {
          if (dir.x !== 0) {
            Components.Animator.setAnimatorState(animator, "walk_side");
          } else if (dir.y < 0) {
            Components.Animator.setAnimatorState(animator, "walk_back");
          } else if (dir.y > 0) {
            Components.Animator.setAnimatorState(animator, "walk_front");

          }
        } else {
          Components.Animator.setAnimatorState(animator, "idle");
        }
      }
    },
  };
}
