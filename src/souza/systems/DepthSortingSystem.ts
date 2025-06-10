import type TransformComponent from "../components/transform";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

const BASE_LAYER = 10000;

export function DepthSortingSystem(): System {
    return {
        update(ecs) {
            const spriteRenders = ecs.getComponentsByType<SpriteRenderComponent>(ComponentType.SPRITE_RENDER);

            for (const spriteRender of spriteRenders) {
                const entity = spriteRender.entityRef;
                if (!entity || entity.tag === "ground") continue;

                const transform = ecs.getComponent<TransformComponent>(entity, ComponentType.TRANSFORM);
                if (!transform) continue;

                const originY = spriteRender.sprite?.originY ?? 0;
                const finalY = transform.position.y + originY;

                spriteRender.layer = BASE_LAYER + Math.floor(finalY);
            }
        }

    };
}
