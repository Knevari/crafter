import { ENGINE } from "../../engine/engine.manager";
import { ECS } from "../../engine/TwoD";
import type { Component } from "../gears/component/component";
import type { CameraComponent } from "../gears/render/camera";
import type { SpriteRenderComponent } from "../gears/render/sprite_render";
import type { TransformComponent } from "../gears/transform";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";

export function get_transform(gameEntity: GameEntity): TransformComponent | null {
    return ECS.Component.getComponent<TransformComponent>(
        ENGINE.DEFAULT_COMPONENT_STATE,
        gameEntity,
        ComponentType.TRANSFORM
    );
}

export function get_camera(gameEntity: GameEntity): CameraComponent | null {
    return ECS.Component.getComponent<CameraComponent>(
        ENGINE.DEFAULT_COMPONENT_STATE,
        gameEntity,
        ComponentType.CAMERA
    );
}

export function get_category<T extends Component>(category: string): T[] {
    return ECS.Component.getComponentsByCategory<T>(
        ENGINE.DEFAULT_COMPONENT_STATE,
        category
    );
}

export function get_sprite_render(gameEntity: GameEntity): SpriteRenderComponent | null {
    return ECS.Component.getComponent<SpriteRenderComponent>(
        ENGINE.DEFAULT_COMPONENT_STATE,
        gameEntity,
        ComponentType.SPRITE_RENDER
    );
}