import { ECS } from "../../../engine/TwoD";
import type { ECSComponentState } from "../../gears/ecs/component";
import type { System } from "../../gears/ecs/system";
import type TransformComponent from "../../gears/transform/transform.types";
import { ComponentType } from "../../types/component-type";
import type { GameEntity } from "../../types/EngineEntity";

export function CameraSystem(componentState: ECSComponentState, camera: GameEntity, player: GameEntity): System {

  let playerTransform: TransformComponent | null = null;
  let cameraTransform: TransformComponent | null = null;

  return {

    start() {
      playerTransform = ECS.Component.getComponent<TransformComponent>(componentState, player, ComponentType.TRANSFORM);
      cameraTransform = ECS.Component.getComponent<TransformComponent>(componentState, camera, ComponentType.TRANSFORM);
    },

    update() {

      if (!playerTransform || !cameraTransform) return;

      const targetX = playerTransform.position.x - window.innerWidth / 2;
      const targetY = playerTransform.position.y - window.innerHeight / 2;

      cameraTransform.position.x = targetX;
      cameraTransform.position.y = targetY;
    }
  };
}
