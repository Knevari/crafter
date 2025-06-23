import { getId } from "../builders/createId";
import type { Component } from "../types/component";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import type { Vec2 } from "../Vec2/Vec2";

export default interface TransformComponent extends Component{
    position: Vec2,
    rotation: number,
    scale: Vec2
}

export function createTransform(
    entity:GameEntity,
    position: Vec2 = {x: 0, y: 0},
    rotation: number = 0,
    scale: Vec2 = {x: 1, y: 1},
): TransformComponent {
    return {
        instanceId: getId(),
        type: ComponentType.TRANSFORM,
        enabled: true,
        gameEntity: entity,
        position: position,
        rotation: rotation,
        scale: scale,
    }
}