import ECSComponents, { ComponentType } from "../ecs";
import type { StaticSpriteComponent } from "../types/sprite";
import type { System } from "./system";


export default function StaticSpriteRenderSystem(ctx: CanvasRenderingContext2D): System {
  return {
    update(ecs: ECSComponents) {
      const entities = ecs.queryEntitiesWithComponents(ComponentType.StaticSprite);

      for (const entity of entities) {
        const sprite = ecs.getComponent<StaticSpriteComponent>(entity, ComponentType.StaticSprite);
        if (!sprite) continue;

        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        const sourceX = sprite.spriteX * sprite.tileSize;
        const sourceY = (sprite.spriteY ?? 0) * sprite.tileSize;

        const drawX = (canvasWidth - sprite.width) / 2;
        const drawY = (canvasHeight - sprite.height) / 2;

        ctx.drawImage(
          sprite.image,
          sourceX,
          sourceY,
          sprite.tileSize,
          sprite.tileSize,
          drawX,
          drawY,
          sprite.width,
          sprite.height
        );
      }
    }
  };
}
