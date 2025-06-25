import type TransformComponent from "../../gears/transform/transform.types";
import { ComponentType } from "../../types/component-type";
import type { SpriteRenderComponent } from "../../gears/render/sprite_render/sprite.render.types";
import type { ECSComponentState } from "../../gears/ecs/component";
import type { System } from "../../gears/ecs/system";
import { ECS } from "../../../engine/TwoD";

const BASE_LAYER = 10000;

export function DepthSortingSystem(componentState: ECSComponentState): System {
    return {
        update() {
        
            const spriteRenders = ECS.Component.getComponentsByType<SpriteRenderComponent>(componentState, ComponentType.SPRITE_RENDER);

            for (const spriteRender of spriteRenders) {
                const entity = spriteRender.gameEntity;
                if (!entity || entity.tag === "ground") continue;

                const transform = ECS.Component.getComponent<TransformComponent>(componentState, entity, ComponentType.TRANSFORM);
                if (!transform) continue;

                const originY = spriteRender.sprite?.origin.y ?? 0;
                const finalY = transform.position.y + originY;

                spriteRender.layer = BASE_LAYER + Math.floor(finalY);
            }
        }

    };
}
