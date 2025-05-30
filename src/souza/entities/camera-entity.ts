import { getId } from "../builders/createId";
import type { ECSComponents } from "../ecs/ecs-components";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";

export function createCamera(ecs: ECSComponents) {
    const camera: CameraComponent = {
      instanceId: getId(),
      type: ComponentType.CAMERA,
      enabled: true,
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0,
    };
    
    ecs.addSingleton<CameraComponent>(ComponentType.CAMERA, camera);
}