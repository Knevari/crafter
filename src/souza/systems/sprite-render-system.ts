import type { ECSComponents } from "../ecs-components";
import { resourceManager } from "../managers/resources-manager";
import { spriteSheetManager } from "../managers/sprite-sheet-manager";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";

import type { System } from "./system";

export default function SpriteRenderSystem(ctx: CanvasRenderingContext2D): System {
  return {
    update(ecs: ECSComponents) {
      const spriteRenderers = ecs.getComponentsByType<SpriteRenderComponent>(ComponentType.SpriteRender);

      for (const spriteRender of spriteRenderers) {
        if (!spriteRender) continue;

        const spriteSheet = spriteSheetManager.get(spriteRender.spriteSheetId);
        if (!spriteSheet) continue;

        const image = resourceManager.getImage(spriteSheet.imageId);
        if (!image.complete) continue;

        const sprite = spriteSheet.sprites[spriteRender.spriteName];
        if (!sprite) continue;

        const x = 100;
        const y = 100;

        const {
          x: sourceX,
          y: sourceY,
          width: frameWidth,
          height: frameHeight
        } = sprite;

        const scale = spriteRender.scale ?? 1;
        const rotation = spriteRender.rotation ?? 0;
        const flipH = spriteRender.flipHorizontal ?? false;
        const flipV = spriteRender.flipVertical ?? false;

        const destWidth = frameWidth * scale;
        const destHeight = frameHeight * scale;

        ctx.save();
        ctx.translate(x + destWidth / 2, y + destHeight / 2);
        ctx.rotate(rotation);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          frameWidth,
          frameHeight,
          -destWidth / 2,
          -destHeight / 2,
          destWidth,
          destHeight
        );

        ctx.restore();
      }
    }
  };
}

