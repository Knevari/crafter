import type { BaseEntity } from "../../lib/types";
import type { ECSComponents } from "../ecs/ecs-components";
import type { CameraComponent } from "../types/camera";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { System } from "./system";

export function cameraSystem(ctx: CanvasRenderingContext2D, player: BaseEntity): System {
  return {
    update(ecs: ECSComponents) {
      const camera = ecs.getSingletonComponent<CameraComponent>(ComponentType.Camera);
      if (!camera) return;

      const playerPos = ecs.getComponent<PositionComponent>(player, ComponentType.Position);
      if (!playerPos) return;

      const targetX = playerPos.x - ctx.canvas.width / 2;
      const targetY = playerPos.y - ctx.canvas.height / 2;

      camera.x = targetX;
      camera.y = targetY;
    }
  };
}
