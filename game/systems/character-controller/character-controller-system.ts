import type TransformComponent from "../../../core/gears/transform/transform.types";
import Vec2Math from "../../../core/helpers/vec2-math";
import Time from "../../../core/time/time";
import type { CharacterControlerComponent } from "./character-controller";
import { ComponentType } from "../../../core/types/component-type";
import type { SpriteRenderComponent } from "../../../core/gears/render/sprite_render/sprite.render.types";
import type { ECSComponentState } from "../../../core/gears/ecs/component";
import type { System } from "../../../core/gears/ecs/system";
import { ECS, Input } from "../../../engine/TwoD";
import { globalKeyState } from "../../input/input.system";

export default function CharacterControlerSystem(componentState: ECSComponentState): System {

  let speed = 0;

  return {
    update() {

      const characterControlers = ECS.Component.getComponentsByType<CharacterControlerComponent>(componentState, "CHARACTER_CONTROLLER");
      for (const characterControler of characterControlers) {

        const spriteRender = ECS.Component.getComponent<SpriteRenderComponent>(componentState, characterControler.gameEntity, ComponentType.SPRITE_RENDER);
        if (!spriteRender) continue;

        const characterTransform = ECS.Component.getComponent<TransformComponent>(componentState, characterControler.gameEntity, ComponentType.TRANSFORM);
        if (!characterTransform) continue;

        characterControler.direction.x = 0;
        characterControler.direction.y = 0;

        if (Input.getKey(globalKeyState, Input.KeyCode.KeyA)) characterControler.direction.x -= 1;
        if (Input.getKey(globalKeyState, Input.KeyCode.KeyD)) characterControler.direction.x += 1;
        if (Input.getKey(globalKeyState, Input.KeyCode.KeyW)) characterControler.direction.y -= 1;
        if (Input.getKey(globalKeyState, Input.KeyCode.KeyS)) characterControler.direction.y += 1;
        characterControler.direction = Vec2Math.normalize(characterControler.direction);

        if (Input.getKey(globalKeyState, Input.KeyCode.ShiftLeft)) {
          speed = characterControler.runSpeed
        } else {
          speed = characterControler.speed;
        }

        characterTransform.position.x += characterControler.direction.x * speed * Time.deltaTime;
        characterTransform.position.y += characterControler.direction.y * speed * Time.deltaTime;

        if (characterControler.direction.x < 0) spriteRender.flipHorizontal = true;
        else if (characterControler.direction.x > 0) spriteRender.flipHorizontal = false;

      }
    }
  };
}
