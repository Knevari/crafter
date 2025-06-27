import type TransformComponent from "../gears/transform/transform.types";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import type { Vec2 } from "../Vec2/Vec2";
import { createIncrementalId } from "./create.incremental.id";

export function createTransformComponent(
    entity: GameEntity,
    position: Vec2 = { x: 0, y: 0 },
    rotation: number = 0,
    scale: Vec2 = { x: 1, y: 1 },
): TransformComponent {
    return {
        category: ComponentType.TRANSFORM,
        instanceId: createIncrementalId(),
        type: ComponentType.TRANSFORM,
        enabled: true,
        gameEntity: entity,
        position: position,
        rotation: rotation,
        scale: scale,
    }
}