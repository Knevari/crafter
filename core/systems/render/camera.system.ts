import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState } from "../../gears/ecs/component";
import type { System } from "../../gears/ecs/system";
import type TransformComponent from "../../gears/transform/transform.types";
import type { CameraComponent } from "../../types/camera";
import { ComponentType } from "../../types/component-type";
import type { GameEntity } from "../../types/EngineEntity";


let playerTransform: TransformComponent | null = null;

export function CameraSystem(ctx: CanvasRenderingContext2D, componentState: ECSComponentState, player: GameEntity): System {
  return {

    start() {
      playerTransform = ECS.Component.getComponent<TransformComponent>(componentState, player, ComponentType.TRANSFORM) ?? null;
    },

    update() {
      const camera = ECS.Component.getSingleton<CameraComponent>(componentState, ComponentType.CAMERA);
      if (!camera) return;

      if (!playerTransform) {
        return;
      };

      const targetX = playerTransform.position.x - ctx.canvas.width / 2;
      const targetY = playerTransform.position.y - ctx.canvas.height / 2;

      camera.transform.position.x = targetX;
      camera.transform.position.y = targetY;
    }
  };
}
