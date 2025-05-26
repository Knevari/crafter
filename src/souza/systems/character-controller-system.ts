import Vec2 from "../helpers/vec2-math";
import Input from "../input/Input";
import { KeyCode } from "../input/KeyCode";
import type { CharacterControlerComponent, PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

export default function CharacterControlerSystem(): System {

  let speed = 0;

  return {
    update(ecs, deltaTime) {
      const characterControlers = ecs.getComponentsByType<CharacterControlerComponent>(ComponentType.CharacterControler);
      for (const characterControler of characterControlers) {

        const entity = ecs.getEntityByComponent(characterControler);
        if (!entity) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(entity, ComponentType.SpriteRender);
        if (!spriteRender) continue;

        const position = ecs.getComponent<PositionComponent>(entity, ComponentType.Position);
        if (!position) continue;

        position.previousX = position.x;
        position.previousY = position.y;

        characterControler.direction.x = 0;
        characterControler.direction.y = 0;

        if (Input.getKey(KeyCode.KeyA)) characterControler.direction.x -= 1;
        if (Input.getKey(KeyCode.KeyD)) characterControler.direction.x += 1;
        if (Input.getKey(KeyCode.KeyW)) characterControler.direction.y -= 1;
        if (Input.getKey(KeyCode.KeyS)) characterControler.direction.y += 1;
        characterControler.direction = Vec2.normalize(characterControler.direction);

        if (Input.getKey(KeyCode.ShiftLeft)) {
          speed = characterControler.runSpeed
        } else {
          speed = characterControler.speed;
        }

        position.x += characterControler.direction.x * speed * deltaTime;
        position.y += characterControler.direction.y * speed * deltaTime;

        if (characterControler.direction.x < 0) spriteRender.flipHorizontal = true;
        else if (characterControler.direction.x > 0) spriteRender.flipHorizontal = false;

      }
    },
  };
}
