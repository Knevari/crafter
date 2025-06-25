import { ECS } from "../../engine/TwoD";
import { createGameEntity } from "../../core/builders/createGameEntity";
import { getId } from "../../core/builders/createId";
import type { ECSComponentState } from "../../core/gears/ecs/component";
import { createTransform } from "../../core/gears/transform/transform.types";
import type { CameraComponent } from "../../core/types/camera";
import { ComponentType } from "../../core/types/component-type";

export function createCamera(componentState: ECSComponentState) {

  const cameraGameEntity = createGameEntity("camera", "MainCamera");

  const camera: CameraComponent = {
    category: ComponentType.CAMERA,
    gameEntity: cameraGameEntity,
    instanceId: getId(),
    type: ComponentType.CAMERA,
    enabled: true,
    zoom: 1,
  };
  ECS.Component.addComponent(componentState, cameraGameEntity, camera);
  
  const transform = createTransform(cameraGameEntity);
  ECS.Component.addComponent(componentState, cameraGameEntity, transform);
  
  return cameraGameEntity;
}