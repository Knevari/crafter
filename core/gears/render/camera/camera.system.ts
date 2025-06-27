import { ECS } from "../../../../engine/TwoD";
import type { ECSComponentState } from "../../ecs/component";
import type { System } from "../../ecs/system";
import type TransformComponent from "../../transform/transform.types";
import { ComponentType } from "../../../types/component-type";
import type { GameEntity } from "../../../types/EngineEntity";

export function CameraSystem(componentState: ECSComponentState, camera: GameEntity, player: GameEntity): System {
  return {

    update() {

      const playerTransform = ECS.Component.getComponent<TransformComponent>(componentState, player, ComponentType.TRANSFORM);

      if (!playerTransform) return;

      const cameraTransform = ECS.Component.getComponent<TransformComponent>(componentState, camera, ComponentType.TRANSFORM);

      if (!cameraTransform) return;

      const targetX = playerTransform.position.x - window.innerWidth / 2;
      const targetY = playerTransform.position.y - window.innerHeight / 2;

      cameraTransform.position.x = targetX;
      cameraTransform.position.y = targetY;
    }
  };
}
