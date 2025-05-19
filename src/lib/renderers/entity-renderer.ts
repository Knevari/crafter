import { ENTITY_DEFINITIONS } from "../entity-defs";
import { gameState } from "../game-state";
import { DrawHelper } from "./draw-helper";

export class EntityRenderer {
  drawEntities(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < gameState.entities.length; i++) {
      const entity = gameState.entities[i];
      const tileSize = ENTITY_DEFINITIONS[entity.type].tileSize ?? 16;
      if (entity.data.hidden) {
        continue;
      }

      if (entity.animator && !entity.inInventory) {
        DrawHelper.drawAnimatedEntity(ctx, entity, tileSize);
        continue;
      }
      if (entity.sprite && !entity.inInventory) {
        DrawHelper.drawEntity(ctx, entity, tileSize);
        continue;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawEntities(ctx);
  }
}
