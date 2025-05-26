import Draw from "../helpers/draw-helper";
import { resourceManager } from "../managers/resources-manager";
import type { CameraComponent } from "../types/camera";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "./system";

export default function SpriteRenderSystem(ctx: CanvasRenderingContext2D): System {
  return {
    render(ecs) {

      const camera = ecs.getSingletonComponent<CameraComponent>(ComponentType.Camera);
      if (!camera) return;

      const spriteRenderers = ecs.getComponentsByType<SpriteRenderComponent>(ComponentType.SpriteRender);
      spriteRenderers.sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));

      for (const spriteRender of spriteRenderers) {
        if (!spriteRender || !spriteRender.enabled) continue;
        const entity = ecs.getEntityByComponent(spriteRender);
        if (!entity) continue;
        const position = ecs.getComponent<PositionComponent>(entity, ComponentType.Position);
        if (!position) continue;

        const sprite = spriteRender.sprite;
        if (sprite) {

          const image = resourceManager.getImage(sprite.textureRef);
          if (!image) continue;

          Draw.drawSprite(
            ctx,
            image,
            sprite.x,
            sprite.y,
            sprite.width,
            sprite.height,
            position.x - camera.x,
            position.y - camera.y,
            spriteRender.color,
            spriteRender.scale ?? 1,
            spriteRender.rotation ?? 0,
            spriteRender.flipHorizontal ?? false,
            spriteRender.flipVertical ?? false
          );
        } else {
          Draw.drawFillRect(ctx, position.x - camera.x, position.y - camera.y, spriteRender.scale ?? 8, spriteRender.scale ?? 8, `rgb(${spriteRender.color.r}, ${spriteRender.color.g}, ${spriteRender.color.b})`)
        }

      }
    },

  };
}
