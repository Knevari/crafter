import type { ECSComponents } from "../ecs/ecs-components";
import { resourceManager } from "../managers/resources-manager";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";

import type { System } from "../types/system";
import type { PositionComponent } from "../types/component-position";
import Draw from "../helpers/draw-helper";

export default function SpriteRenderSystem(ctx: CanvasRenderingContext2D): System {
  return {
    update(ecs: ECSComponents) {
      const spriteRenderers = ecs.getComponentsByType<SpriteRenderComponent>(ComponentType.SpriteRender);

      for (const spriteRender of spriteRenderers) {
        if (!spriteRender) continue;

        const sprite = spriteRender.sprite;
        if (!sprite) continue;

        const entity = ecs.getEntityByComponent(spriteRender);
        if (!entity) continue;

        const position = ecs.getComponent<PositionComponent>(entity, ComponentType.Position);
        if (!position) continue;

        const image = resourceManager.getImage(sprite.textureRef);
        if (!image) continue;

        Draw.drawSprite(
          ctx,
          image,
          sprite.x,
          sprite.y,
          sprite.width,
          sprite.height,
          position.x,
          position.y,
          spriteRender.scale ?? 1,
          spriteRender.rotation ?? 0,
          spriteRender.flipHorizontal ?? false,
          spriteRender.flipVertical ?? false
        );

        Draw.drawWireCircle(
          ctx,
          position.x,
          position.y,
          sprite.width * (spriteRender.scale ?? 1),
          sprite.height * (spriteRender.scale ?? 1),
          'lime',
          1     
        );

      }
    },
  };
}
