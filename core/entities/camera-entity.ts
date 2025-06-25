import { ECS } from "../../engine/TwoD";
import { createGameEntity } from "../builders/createGameEntity";
import { getId } from "../builders/createId";
import type { ECSComponentState } from "../gears/ecs/component";
import { createTransform } from "../gears/transform/transform.types";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";

export function createCamera(componentState: ECSComponentState) {
  const camera: CameraComponent = {
    instanceId: getId(),
    type: ComponentType.CAMERA,
    enabled: true,
    transform: createTransform(createGameEntity("a")),
      zoom: 1,
  };

  ECS.Component.addSingleton<CameraComponent>(componentState, ComponentType.CAMERA, camera);
}