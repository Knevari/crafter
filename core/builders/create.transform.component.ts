import { matrixManager } from "../../webgl/managers/matrix_manager";
import { createMat4 as createIdentityMat4, rotateMatrix, scaleMatrix, translateMatrix } from "../../webgl/mat4";
import { generic_manager_add } from "../../webgl/managers/generic_manager";
import type { TransformComponent, TransformOptions } from "../gears/transform";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export function createTransformComponent(
    entity: GameEntity,
    options?: TransformOptions
): TransformComponent {

    const transform: TransformComponent = {
        category: ComponentType.TRANSFORM,
        instanceId: createIncrementalId(),
        type: ComponentType.TRANSFORM,
        enabled: true,
        gameEntity: entity,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        scale: { x: 1, y: 1, z: 1 },
        ...options
    }

    const modelMatrix = createIdentityMat4();

    scaleMatrix(modelMatrix, options?.scale ?? { x: 1, y: 1, z: 1 });
    rotateMatrix(modelMatrix, options?.rotation ?? { x: 0, y: 0, z: 0, w: 1 });
    translateMatrix(modelMatrix, options?.position ?? { x: 0, y: 0, z: 0 });

    generic_manager_add(matrixManager, transform.instanceId, modelMatrix);

    return transform;
}