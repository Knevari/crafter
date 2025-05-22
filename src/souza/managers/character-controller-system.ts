import { pressedKeys } from "../../lib/input";
import type { AnimatorComponent } from "../types/animator";
import type { CharacterControlerComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

export default function CharacterControllerComponent(): System {
  return {
    update(ecs, deltaTime) {
      const entities = ecs.queryEntitiesWithComponents(
        ComponentType.CharacterControler,
        ComponentType.Animator
      );

      for (const entity of entities) {
        const animator = ecs.getComponent<AnimatorComponent>(
          entity,
          ComponentType.Animator
        );
        if (!animator) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(
          entity,
          ComponentType.SpriteRender
        );
        if (!spriteRender) continue;

        if (pressedKeys.has("s")) {
        
          animator.currentAnimation = "walk_back";
        } else if (pressedKeys.has("w")) {
        
          animator.currentAnimation = "walk_front";
        } else if (pressedKeys.has("a")) {
          
          spriteRender.flipHorizontal = true;
          animator.currentAnimation = "walk_side";
        } else if (pressedKeys.has("d")) {
          
          spriteRender.flipHorizontal = false;
          animator.currentAnimation = "walk_side";
        } else {
          
          animator.currentAnimation = "idle";
        }
      }
    },
  };
}
