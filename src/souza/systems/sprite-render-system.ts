import type { ECSComponents } from "./ecs-components";
import { resourceManager } from "../managers/resources-manager";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";

import type { System } from "../types/system";
import type { PositionComponent } from "../types/component-position";

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

        drawSprite(
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

        drawWireCircle(
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

function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  sourceHeight: number,
  destX: number,
  destY: number,
  scale = 1,
  rotation = 0,
  flipH = false,
  flipV = false
) {
  const destWidth = sourceWidth * scale;
  const destHeight = sourceHeight * scale;

  ctx.save();
  ctx.translate(destX + destWidth / 2, destY + destHeight / 2);
  ctx.rotate(rotation);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -destWidth / 2,
    -destHeight / 2,
    destWidth,
    destHeight
  );

  ctx.restore();
}

function drawWireSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'red',
  lineWidth = 1
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

function drawWireCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'red',
  lineWidth = 1
) {
  const radius = (width + height) / 4; 

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

