import type TransformComponent from "../components/transform";
import Vec2Math from "../helpers/vec2-math";
import Input from "../input/Input";
import { KeyCode } from "../input/KeyCode";
import Time from "../time/time";
import type { CharacterControlerComponent } from "../types/character-controller";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";
export default function CharacterControlerSystem(): System {

  let speed = 0;

  return {
    update(ecs) {
      const characterControlers = ecs.getComponentsByType<CharacterControlerComponent>(ComponentType.CHARACTER_CONTROLLER);
      for (const characterControler of characterControlers) {

        const entity = ecs.getEntityByComponent(characterControler);
        if (!entity) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(entity, ComponentType.SPRITE_RENDER);
        if (!spriteRender) continue;

        const characterTransform = ecs.getComponent<TransformComponent>(entity, ComponentType.TRANSFORM);
        if (!characterTransform) continue;

        characterControler.direction.x = 0;
        characterControler.direction.y = 0;

        if (Input.getKey(KeyCode.KeyA)) characterControler.direction.x -= 1;
        if (Input.getKey(KeyCode.KeyD)) characterControler.direction.x += 1;
        if (Input.getKey(KeyCode.KeyW)) characterControler.direction.y -= 1;
        if (Input.getKey(KeyCode.KeyS)) characterControler.direction.y += 1;
        characterControler.direction = Vec2Math.normalize(characterControler.direction);

        if (Input.getKey(KeyCode.ShiftLeft)) {
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
