import type { ECSComponents } from "../ecs/ecs-components";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";

export function createCamera(ecs: ECSComponents) {
    const camera: CameraComponent = {
      enabled: true,
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0,
    };
    
    ecs.addSingleton<CameraComponent>(ComponentType.Camera, camera);
}