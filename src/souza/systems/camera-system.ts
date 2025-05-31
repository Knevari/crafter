import type { Entity } from "../../lib/types";
import type TransformComponent from "../components/transform";
import type { ECSComponents } from "../ecs/ecs-components";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";
import type { System } from "../types/system";

export function cameraSystem(ctx: CanvasRenderingContext2D, player: Entity): System {

  let playerTransform: TransformComponent | null = null;
  return {

    start(ecs) {
      playerTransform = ecs.getComponent<TransformComponent>(player, ComponentType.TRANSFORM) ?? null;
    },

    update(ecs: ECSComponents) {
      const camera = ecs.getSingletonComponent<CameraComponent>(ComponentType.CAMERA);
      if (!camera) return;

      if (!playerTransform) {
        return;
      };

      const targetX = playerTransform.position.x - ctx.canvas.width / 2;
      const targetY = playerTransform.position.y - ctx.canvas.height / 2;

      camera.x = targetX;
      camera.y = targetY;
    }
  };
}
