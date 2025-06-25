import Input from "../input/Input";
import { KeyCode } from "../input/KeyCode";
import type { CharacterControlerComponent } from "../types/character-controller";
import { ComponentType } from "../types/component-type";
import { Components, ECS } from "../../engine/TwoD";
import type { System } from "../gears/ecs/system";
import type { ECSComponentState } from "../gears/ecs/component";


export default function CharacterControllerAnimationSystem(componentState:ECSComponentState): System {
  return {
    lateUpdate() {
    
      const characterControlers = ECS.Component.getComponentsByType<CharacterControlerComponent>(componentState, ComponentType.CHARACTER_CONTROLLER);

      for (const characterControler of characterControlers) {

        const animator = ECS.Component.getComponent<Components.Animator.AnimatorComponent>(componentState, characterControler.gameEntity, ComponentType.ANIMATOR);
        if (!animator) continue;

        animator.playbackSpeed = Input.getKey(KeyCode.ShiftLeft) ? 1.5 : 1.0;

        const dir = characterControler.direction;
        if (Input.getMouseButtonDown(0)) {
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
