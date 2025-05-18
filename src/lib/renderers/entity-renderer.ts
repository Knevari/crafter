import { gameState } from "../game-state";
import { DrawHelper } from "./draw-helper";

export class EntityRenderer {
  drawEntities(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < gameState.entities.length; i++) {
      const entity = gameState.entities[i];

      if (entity.animator && !entity.inInventory) {
        DrawHelper.drawAnimatedEntity(ctx, entity);
        continue;
      }
      if (entity.sprite && !entity.inInventory) {
        DrawHelper.drawEntity(ctx, entity);
        continue;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawEntities(ctx);
  }
}
