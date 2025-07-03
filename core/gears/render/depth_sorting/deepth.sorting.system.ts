import { ComponentType } from "../../../types/component-type";
import type { SpriteRenderComponent } from "../sprite_render/sprite.render.types";
import type { ECSComponentState } from "../../ecs/component";
import type { System } from "../../ecs/system";
import { ECS } from "../../../../engine/TwoD";
import { Layer } from "../../../builders/create.game.entity";
import type { TransformComponent } from "../../transform";

const BASE_LAYER = 10000;

export function DepthSortingSystem(componentState: ECSComponentState): System {
    return {
        update() {
            const spriteRenders = ECS.Component.getComponentsByType<SpriteRenderComponent>(
                componentState,
                ComponentType.SPRITE_RENDER
            );

            for (const spriteRender of spriteRenders) {
                const entity = spriteRender.gameEntity;

                if ((entity.layerMask & Layer.IgnoreDepthSorting) !== 0) {
                    continue;
                }

                const transform = ECS.Component.getComponent<TransformComponent>(
                    componentState,
                    entity,
                    ComponentType.TRANSFORM
                );
                if (!transform) continue;

                const originY = spriteRender.sprite?.origin.y ?? 0;
                const finalY = transform.position.y + originY;

                spriteRender.layer = BASE_LAYER + Math.floor(finalY);
            }
        }
    };
}
