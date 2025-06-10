import { createEntity } from "../builders/createEntity";
import { getId } from "../builders/createId";
import { createTransform } from "../components/transform";
import type { ECSComponents } from "../ecs/ecs-components";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";




export function createCamera(ecs: ECSComponents) {
  const camera: CameraComponent = {
    instanceId: getId(),
    type: ComponentType.CAMERA,
    enabled: true,
    transform: createTransform(createEntity("a")),
      zoom: 1,
  };

  ecs.addSingleton<CameraComponent>(ComponentType.CAMERA, camera);
}