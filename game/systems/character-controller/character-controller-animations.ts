import { ComponentType } from "../../../core/types/component-type";
import { Components, ECS, Input } from "../../../engine/TwoD";
import type { System } from "../../../core/gears/ecs/system";
import type { ECSComponentState } from "../../../core/gears/ecs/component";
import type { CharacterControlerComponent } from "./character-controller";
import { globalKeyState, globalMouseState } from "../../input/input.system";


export default function CharacterControllerAnimationSystem(componentState:ECSComponentState): System {
  return {
    lateUpdate() {
    
      const characterControlers = ECS.Component.getComponentsByType<CharacterControlerComponent>(componentState, "CHARACTER_CONTROLLER");

      for (const characterControler of characterControlers) {

        const animator = ECS.Component.getComponent<Components.Animator.AnimatorComponent>(componentState, characterControler.gameEntity, ComponentType.ANIMATOR);
        if (!animator) continue;

        animator.playbackSpeed = Input.getKey(globalKeyState, Input.KeyCode.ShiftLeft) ? 1.5 : 1.0;

        const dir = characterControler.direction;
        if (Input.getMouseButtonDown(globalMouseState, 0)) {
          if (dir.x !== 0) {
            Components.Animator.setAnimatorState(animator, "attack_side", true);
          } else if (dir.y > 0) {
            Components.Animator.setAnimatorState(animator, "attack_down", true);
          } else if (dir.y < 0) {
            Components.Animator.setAnimatorState(animator, "attack_up", true);
          } else {
            Components.Animator.setAnimatorState(animator, "attack_side", true); 
          }
        }

        if (dir.x !== 0 || dir.y !== 0) {
          if (dir.x !== 0) {
            Components.Animator.setAnimatorState(animator, "walk_side");
          } else if (dir.y < 0) {
            Components.Animator.setAnimatorState(animator, "walk_front");
          } else if (dir.y > 0) {
            Components.Animator.setAnimatorState(animator, "walk_back");
          }
        } else {
          Components.Animator.setAnimatorState(animator, "idle");
        }
      }
    },
  };
}
