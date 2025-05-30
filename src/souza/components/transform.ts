import type { Entity } from "../../lib/types";
import { getId } from "../builders/createId";
import type { Component } from "../types/component";
import { ComponentType } from "../types/component-type";
import type { Vector2 } from "../types/vector2";

export default interface TransformComponent extends Component{
    position: Vector2,
    rotation: number,
    scale: Vector2
}

export function createTransform(
    entity:Entity,
    position: Vector2 = {x: 0, y: 0},
    rotation: number = 0,
    scale: Vector2 = {x: 1, y: 1},
): TransformComponent {
    return {
        instanceId: getId(),
        type: ComponentType.TRANSFORM,
        enabled: true,
        entityRef: entity,
        position: position,
        rotation: rotation,
        scale: scale,
    }
}