import { pressedKeys } from "../../lib/input";
import { mag } from "../../lib/math";
import { playerCanMoveThere } from "../../lib/player";
import type { PositionComponent, CharacterMovementComponent } from "../types/component-position";
import type { ECSComponents } from "../ecs-components";
import { ComponentType } from "../types/component-type";
import type { System } from "./system";

export default function CharacterMovementSystem(): System {
  return {
    update(ecs: ECSComponents, deltaTime: number) {

      const entities = ecs.queryEntitiesWithComponents(
        ComponentType.CharacterMovement
      );

      for (const entity of entities) {
        const position = ecs.getComponent<PositionComponent>(entity, ComponentType.Position);
        const movement = ecs.getComponent<CharacterMovementComponent>(entity, ComponentType.CharacterMovement);
        if (!position || !movement) continue;

        let dir = { x: 0, y: 0 };
        if (pressedKeys.has("w")) dir.y -= 1;
        if (pressedKeys.has("s")) dir.y += 1;
        if (pressedKeys.has("a")) dir.x -= 1;
        if (pressedKeys.has("d")) dir.x += 1;

        if (dir.x === 1) {
          movement.facing = "right";
          movement.moving = true;
        } else if (dir.x === -1) {
          movement.facing = "left";
          movement.moving = true;
        } else if (dir.y === -1) {
          movement.facing = "up";
          movement.moving = true;
        } else if (dir.y === 1) {
          movement.facing = "down";
          movement.moving = true;
        } else {
          movement.moving = false;
        }

        const [nx, ny] = mag(dir.x, dir.y);
        movement.direction.x = nx;
        movement.direction.y = ny;

        if (movement.moving) {
          const nextX = position.x + movement.direction.x * movement.speed * deltaTime;
          const nextY = position.y + movement.direction.y * movement.speed * deltaTime;

          if (playerCanMoveThere(nextX, nextY)) {
            position.x = nextX;
            position.y = nextY;
          } else if (playerCanMoveThere(nextX, position.y)) {
            position.x = nextX;
          } else if (playerCanMoveThere(position.x, nextY)) {
            position.y = nextY;
          }
        }
      }
    }
  }
};
