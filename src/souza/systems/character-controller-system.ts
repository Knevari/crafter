import type { Position } from "../../lib/types";
import Input from "../input/Input";
import { KeyCode } from "../input/KeyCode";
import { setAnimatorState, type AnimatorComponent } from "../types/animator";
import type { CharacterControlerComponent, PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import PositionMath from "../helpers/position-math";
import type { System } from "./system";

// export default function CharacterControllerComponent(): System {
//   return {
//     update(ecs, deltaTime) {
//       const entities = ecs.queryEntitiesWithComponents(
//         ComponentType.CharacterControler,
//         ComponentType.Animator
//       );

//       for (const entity of entities) {
//         const characterControler = ecs.getComponent<CharacterControlerComponent>(
//           entity,
//           ComponentType.CharacterControler
//         );
//         const animator = ecs.getComponent<AnimatorComponent>(
//           entity,
//           ComponentType.Animator
//         );
//         const spriteRender = ecs.getComponent<SpriteRenderComponent>(
//           entity,
//           ComponentType.SpriteRender
//         );
//         const position = ecs.getComponent<PositionComponent>(
//           entity,
//           ComponentType.Position
//         );
//         if (!animator || !spriteRender || !position || !characterControler) continue;
//         if(!position.enabled) continue;

//         position.previousX = position.x;
//         position.previousY = position.y;

//         let dir: Position = { x: 0, y: 0 };

//         if (Input.getKey(KeyCode.KeyA)) dir.x -= 1;
//         if (Input.getKey(KeyCode.KeyD)) dir.x += 1;
//         if (Input.getKey(KeyCode.KeyW)) dir.y -= 1;
//         if (Input.getKey(KeyCode.KeyS)) dir.y += 1;
//         dir = PositionMath.normalize(dir);

//         if (Input.getKey(KeyCode.ShiftLeft)) {
//           animator.playbackSpeed = 1.5
//           position.x += dir.x * characterControler.speed * 1.5 * deltaTime;
//           position.y += dir.y * characterControler.speed * 1.5 * deltaTime;
//         } else {
//           animator.playbackSpeed = 1.0
//           position.x += dir.x * characterControler.speed * deltaTime;
//           position.y += dir.y * characterControler.speed * deltaTime;
//         }

//         if (dir.x < 0) spriteRender.flipHorizontal = true;
//         else if (dir.x > 0) spriteRender.flipHorizontal = false;

//         if (dir.x !== 0) characterControler.lastDirection = "side";
//         else if (dir.y > 0) characterControler.lastDirection = "up";
//         else if (dir.y < 0) characterControler.lastDirection = "down";


//         if (Input.getMouseButtonDown(0)) {
//           switch (characterControler.lastDirection) {
//             case "up":
//               setAnimatorState(animator, "attack_down", true);
//               break;
//             case "side":
//               setAnimatorState(animator, "attack_side", true);
//               break;
//             case "down":
//             default:
//               setAnimatorState(animator, "attack_up", true);
//               break;
//           }
//         } else if (dir.x !== 0) {
//           animator.controller
//           setAnimatorState(animator, "walk_side");
//         } else if (dir.y > 0) {
//           setAnimatorState(animator, "walk_back");
//         } else if (dir.y < 0) {
//           setAnimatorState(animator, "walk_front");
//         } else {
//           setAnimatorState(animator, "idle");
//         }

//       }
//     },
//   };
// }


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
        if(!position.enabled) continue;

        position.previousX = position.x;
        position.previousY = position.y;

        let dir: Position = { x: 0, y: 0 };

        if (Input.getKey(KeyCode.KeyA)) dir.x -= 1;
        if (Input.getKey(KeyCode.KeyD)) dir.x += 1;
        if (Input.getKey(KeyCode.KeyW)) dir.y -= 1;
        if (Input.getKey(KeyCode.KeyS)) dir.y += 1;
        dir = PositionMath.normalize(dir);

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
              setAnimatorState(animator, "attack_down", true);
              break;
            case "side":
              setAnimatorState(animator, "attack_side", true);
              break;
            case "down":
            default:
              setAnimatorState(animator, "attack_up", true);
              break;
          }
        } else if (dir.x !== 0) {
          animator.controller
          setAnimatorState(animator, "walk_side");
        } else if (dir.y > 0) {
          setAnimatorState(animator, "walk_back");
        } else if (dir.y < 0) {
          setAnimatorState(animator, "walk_front");
        } else {
          setAnimatorState(animator, "idle");
        }

      }
    },
  };
}
