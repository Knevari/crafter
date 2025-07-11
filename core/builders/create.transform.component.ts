
import { generic_manager_add } from "../managers/generic_manager";
import type { TransformComponent, TransformOptions } from "../gears/transform";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";
import { ENGINE } from "../../engine/engine.manager";
import { mat4_create_TRS, mat4_identity } from "../webgl/mat4";

export function createTransformComponent(
    entity: GameEntity,
    options?: TransformOptions
): TransformComponent {

    const transform: TransformComponent = {
        category: ComponentType.TRANSFORM,
        instance: createIncrementalId(),
        type: ComponentType.TRANSFORM,
        enabled: true,
        gameEntity: entity,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        scale: { x: 1, y: 1, z: 1 },
        ...options
    }

    const modelMatrix = mat4_identity();

    mat4_create_TRS(modelMatrix, transform.position, transform.rotation, transform.scale);
    generic_manager_add(ENGINE.MANAGER.MAT4, transform.instance, modelMatrix);

    return transform;
}