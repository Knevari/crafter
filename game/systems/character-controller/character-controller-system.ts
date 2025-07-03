import Vec2Math from "../../../core/helpers/vec2-math";
import Time from "../../../core/time/time";
import { type Types, ECS, Enums, Input } from "../../../engine/TwoD";
import { globalKeyState } from "../../input/input.system";
import type { CharacterControlerComponent } from "./character.controller.types";

export default function CharacterControlerSystem(componentState: Types.ECSComponentState): Types.System {
  return {
    update() {
      const characterControlers = ECS.Component.getComponentsByType<CharacterControlerComponent>(
        componentState,
        "CHARACTER_CONTROLLER"
      );
      for (const characterControler of characterControlers) {

        const spriteRender = ECS.Component.getComponent<Types.SpriteRenderComponent>(
          componentState,
          characterControler.gameEntity,
          Enums.ComponentType.SPRITE_RENDER
        );
        if (!spriteRender) continue;

        const characterTransform = ECS.Component.getComponent<Types.TransformComponent>(
          componentState,
          characterControler.gameEntity,
          Enums.ComponentType.TRANSFORM
        );
        if (!characterTransform) continue;

        characterControler.direction.x = 0;
        characterControler.direction.y = 0;

        if (Input.getKey(globalKeyState, Input.KeyCode.KeyA)) characterControler.direction.x -= 1;
        if (Input.getKey(globalKeyState, Input.KeyCode.KeyD)) characterControler.direction.x += 1;
        if (Input.getKey(globalKeyState, Input.KeyCode.KeyW)) characterControler.direction.y += 1;
        if (Input.getKey(globalKeyState, Input.KeyCode.KeyS)) characterControler.direction.y -= 1;

        characterControler.direction = Vec2Math.normalize(characterControler.direction);

        const speed = Input.getKey(globalKeyState, Input.KeyCode.ShiftLeft)
          ? characterControler.runSpeed
          : characterControler.speed;

        const deltaX = characterControler.direction.x * speed * Time.deltaTime;
        const deltaY = characterControler.direction.y * speed * Time.deltaTime;

        characterTransform.position.x += deltaX;
        characterTransform.position.y += deltaY;

        if (characterControler.direction.x < 0) spriteRender.flipHorizontal = true;
        else if (characterControler.direction.x > 0) spriteRender.flipHorizontal = false;
      }
    },
  };
}
