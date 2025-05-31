import type TransformComponent from "../components/transform";
import Draw from "../helpers/draw-helper";
import { resourceManager } from "../managers/resources-manager";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";

export default function SpriteRenderSystem(ctx: CanvasRenderingContext2D): System {
  return {
    render(ecs) {

      const camera = ecs.getSingletonComponent<CameraComponent>(ComponentType.CAMERA);
      if (!camera) return;

      const spriteRenderers = ecs.getComponentsByType<SpriteRenderComponent>(ComponentType.SPRITE_RENDER);
      spriteRenderers.sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));

      for (const spriteRender of spriteRenderers) {
        if (!spriteRender || !spriteRender.enabled) continue;
        const entity = ecs.getEntityByComponent(spriteRender);
        if (!entity) continue;
        const transform = ecs.getComponent<TransformComponent>(entity, ComponentType.TRANSFORM);
        if (!transform) continue;

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
            transform.position.x - camera.x,
            transform.position.y - camera.y,
            spriteRender.scale ?? 1,
            spriteRender.rotation ?? 0,
            spriteRender.flipHorizontal ?? false,
            spriteRender.flipVertical ?? false,
            spriteRender.alpha ?? 1.0
          );
        } else {
          Draw.drawFillRect(ctx, transform.position.x - camera.x, transform.position.y - camera.y, spriteRender.scale ?? 8, spriteRender.scale ?? 8, spriteRender.color ?? " #ffffff")
        }

      }
    },

  };
}
