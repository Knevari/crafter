import { generic_manager_add } from "../managers/generic_manager";
import type { CameraComponent } from "../gears/render/camera";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";
import { mat4_identity, mat4_create_projection } from "../webgl/mat4";
import { ENGINE } from "../../engine/engine.manager";

export function createCameraComponent(gameEntity: GameEntity) {
    const camera: CameraComponent = {
        category: ComponentType.CAMERA,
        gameEntity: gameEntity,
        instance: createIncrementalId(),
        type: ComponentType.CAMERA,
        enabled: true,
        aspec: 1,
        near: 0.0,
        far: 100,
        fov: 90
    };


    const identity = mat4_identity();
    mat4_create_projection(
        identity,
        camera.fov,
        window.innerWidth / window.innerHeight,
        camera.near,
        camera.far
    );

    generic_manager_add(ENGINE.MANAGER.MAT4, camera.instance, identity);

    return camera;

}
