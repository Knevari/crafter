import { matrixManager } from "../../webgl/managers/matrix_manager";
import { generic_manager_add } from "../../webgl/managers/generic_manager";
import type { CameraComponent } from "../gears/render/camera";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";
import { createIdentity, updateProjectionMatrix } from "../../webgl/mat4";

export function createCameraComponent(gameEntity: GameEntity) {
    const camera: CameraComponent = {
        category: ComponentType.CAMERA,
        gameEntity: gameEntity,
        instanceId: createIncrementalId(),
        type: ComponentType.CAMERA,
        enabled: true,
        aspec: 1,
        near: 0.0,
        far: 100,
        fov: 90
    };


    const identity = createIdentity();
    updateProjectionMatrix(
        identity,
        camera.fov,
        window.innerWidth / window.innerHeight,
        camera.near,
        camera.far
    );

    generic_manager_add(matrixManager, camera.instanceId, identity);

    return camera;

}
