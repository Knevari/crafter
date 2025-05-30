import Input from "../input/Input";
import { KeyCode } from "../input/KeyCode";
import { setAnimatorState, type AnimatorComponent } from "../types/animator";
import type { CharacterControlerComponent } from "../types/character-controller";
import { ComponentType } from "../types/component-type";
import type { System } from "../types/system";

export default function CharacterControllerAnimationSystem(): System {
  return {
    latedUpdate(ecs) {

      const characterControlers = ecs.getComponentsByType<CharacterControlerComponent>(ComponentType.CHARACTER_CONTROLLER);

      for (const characterControler of characterControlers) {

        const entity = ecs.getEntityByComponent(characterControler);
        if (!entity) continue;

        const animator = ecs.getComponent<AnimatorComponent>(entity, ComponentType.ANIMATOR);
        if (!animator) continue;

        animator.playbackSpeed = Input.getKey(KeyCode.ShiftLeft) ? 1.5 : 1.0;

        const dir = characterControler.direction;
        if (Input.getMouseButtonDown(0)) {
          if (dir.x !== 0) {
            setAnimatorState(animator, "attack_side", true);
          } else if (dir.y > 0) {
            setAnimatorState(animator, "attack_down", true);
          } else if (dir.y < 0) {
            setAnimatorState(animator, "attack_up", true);
          } else {
            setAnimatorState(animator, "attack_side", true); 
          }
        }

        if (dir.x !== 0 || dir.y !== 0) {
          if (dir.x !== 0) {
            setAnimatorState(animator, "walk_side");
          } else if (dir.y < 0) {
            setAnimatorState(animator, "walk_front");
          } else if (dir.y > 0) {
            setAnimatorState(animator, "walk_back");
          }
        } else {
          setAnimatorState(animator, "idle");
        }
      }
    },
  };
}
