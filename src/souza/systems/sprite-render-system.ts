import type TransformComponent from "../components/transform";
import { engine2d } from "../Engine2d";
import Draw from "../helpers/draw-helper";
import Vec2Math from "../helpers/vec2-math";
import { resourceManager } from "../managers/resources-manager";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type { System } from "../types/system";
import type { Vec2 } from "../Vec2/Vec2";

export default function SpriteRenderSystem(): System {
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

        const position = Vec2Math.subtract(transform.position, camera.transform.position);
        const scale: Vec2 = { x: spriteRender.scale ?? 32, y: spriteRender.scale ?? 32 };
        const ctx = engine2d.getContext();
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
            position,
            scale,
            { x: sprite.originX ?? 0.5, y: sprite.originY ?? 0.5 },
            0,
            spriteRender.flipHorizontal ?? false,
            spriteRender.flipVertical ?? false,
            spriteRender.alpha ?? 1.0
          );


          const origin: Vec2 = { x: sprite.originX, y: sprite.originY };
          Draw.drawWireSquare(ctx, position, scale, origin, "rgb(255, 0, 0)")
        } else {

          const origin: Vec2 = { x: 0.5, y: 0.5 };
          Draw.drawFillRect(ctx, position, scale, origin, spriteRender.color ?? " #ffffff")
        }

      }
    },

  };
}
