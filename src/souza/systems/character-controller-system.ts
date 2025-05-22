import type { Position } from "../../lib/types";
import {
  PLAYER_IDLE_DOWN_CLIP,
  PLAYER_WALK_UP_CLIP,
  PLAYER_WALK_DOWN_CLIP,
  PLAYER_WALK_SIDE_CLIP,
  PLAYER_ATTACK_DOWN_CLIP,
  PLAYER_ATTACK_SIDE_CLIP,
  PLAYER_ATTACK_UP_CLIP,
} from "../game/player-animations";
import Input from "../input/Input";
import { KeyCode } from "../input/KeyCode";
import { setAnimation, type AnimatorComponent } from "../types/animator";
import type { CharacterControlerComponent, PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";
import { normalize } from "./normalize-position";

export default function CharacterControllerComponent(): System {
  return {
    update(ecs, deltaTime) {
      const entities = ecs.queryEntitiesWithComponents(
        ComponentType.CharacterControler,
        ComponentType.Animator
      );

      for (const entity of entities) {
        const characterControler = ecs.getComponent<CharacterControlerComponent>(
          entity,
          ComponentType.CharacterControler
        );
        const animator = ecs.getComponent<AnimatorComponent>(
          entity,
          ComponentType.Animator
        );
        const spriteRender = ecs.getComponent<SpriteRenderComponent>(
          entity,
          ComponentType.SpriteRender
        );
        const position = ecs.getComponent<PositionComponent>(
          entity,
          ComponentType.Position
        );
        if (!animator || !spriteRender || !position || !characterControler) continue;


        let dir: Position = { x: 0, y: 0 };

        if (Input.getKey(KeyCode.KeyA)) dir.x -= 1;
        if (Input.getKey(KeyCode.KeyD)) dir.x += 1;
        if (Input.getKey(KeyCode.KeyW)) dir.y -= 1;
        if (Input.getKey(KeyCode.KeyS)) dir.y += 1;
        dir = normalize(dir);

        if (Input.getKey(KeyCode.ShiftLeft)) {
          animator.playbackSpeed = 1.5
          position.x += dir.x * characterControler.speed * 1.5 * deltaTime;
          position.y += dir.y * characterControler.speed * 1.5 * deltaTime;
        } else {
                animator.playbackSpeed = 1.0
           position.x += dir.x * characterControler.speed * deltaTime;
          position.y += dir.y * characterControler.speed * deltaTime;
        }

        if (dir.x < 0) spriteRender.flipHorizontal = true;
        else if (dir.x > 0) spriteRender.flipHorizontal = false;

        if (dir.x !== 0) characterControler.lastDirection = "side";
        else if (dir.y > 0) characterControler.lastDirection = "up";
        else if (dir.y < 0) characterControler.lastDirection = "down";


        if (Input.getMouseButtonDown(0)) {
          switch (characterControler.lastDirection) {
            case "up":
              setAnimation(animator, PLAYER_ATTACK_DOWN_CLIP, true);
              break;
            case "side":
              setAnimation(animator, PLAYER_ATTACK_SIDE_CLIP, true);
              break;
            case "down":
            default:
              setAnimation(animator, PLAYER_ATTACK_UP_CLIP, true);
              break;
          }
        } else if (dir.x !== 0) {
          setAnimation(animator, PLAYER_WALK_SIDE_CLIP);
        } else if (dir.y > 0) {
          setAnimation(animator, PLAYER_WALK_UP_CLIP);
        } else if (dir.y < 0) {
          setAnimation(animator, PLAYER_WALK_DOWN_CLIP);
        } else {
          setAnimation(animator, PLAYER_IDLE_DOWN_CLIP);
        }

      }
    },
  };
}
