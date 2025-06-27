import type { CameraComponent } from "../gears/render/camera";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export function createCameraComponent(gameEntity: GameEntity) {
    const camera: CameraComponent = {
        category: ComponentType.CAMERA,
        gameEntity: gameEntity,
        instanceId: createIncrementalId(),
        type: ComponentType.CAMERA,
        enabled: true,
        zoom: 1,
    };

    return camera;

}