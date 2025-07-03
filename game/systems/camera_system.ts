import type { GameEntity } from "../../core/types/EngineEntity";
import { ComponentType } from "../../engine/enums";
import type { System } from "../../engine/resources";
import { ECS } from "../../engine/TwoD";
import type { TransformComponent, ECSComponentState } from "../../engine/types";

export function CameraSystem(componentState: ECSComponentState, cameraEntity: GameEntity, targetEntity: GameEntity): System {

    let cameraTransform: TransformComponent | null = null;
    let targetTransform: TransformComponent | null = null;

    return {
        start() {
            cameraTransform = ECS.Component.getComponent<TransformComponent>(componentState, cameraEntity, ComponentType.TRANSFORM);
            targetTransform = ECS.Component.getComponent<TransformComponent>(componentState, targetEntity, ComponentType.TRANSFORM);
        },

        update() {
            if (!targetTransform || !cameraTransform) return;
            cameraTransform.position.x = targetTransform.position.x;
            cameraTransform.position.y = targetTransform.position.y;

        },
    };

}