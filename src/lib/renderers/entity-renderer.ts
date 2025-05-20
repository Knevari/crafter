import { TILE_SIZE } from "../constants";
import { getCollisionBoxDimensions } from "../entities";
import { ENTITY_DEFINITIONS } from "../entity-defs";
import { gameState } from "../game-state";
import type { Entity } from "../types";
import { DrawHelper } from "./draw-helper";

export class EntityRenderer {
  private drawEntityHealthBar(ctx: CanvasRenderingContext2D, entity: Entity) {
    const cbox = getCollisionBoxDimensions(entity);

    const maxHealthBarWidth = cbox.width;
    const healthBarWidth =
      maxHealthBarWidth * (entity.health.current / (entity.health.max ?? 1));

    const entityHeight = entity.dimensions.height * TILE_SIZE;

    const healthBarX =
      entity.position.x +
      (entity.dimensions.width * TILE_SIZE) / 2 -
      maxHealthBarWidth / 2;
    const healthBarY =
      entity.position.y +
      entity.collisionBox.yPercentage * entity.dimensions.height * TILE_SIZE -
      5;

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.fillRect(
      healthBarX - gameState.camera.position.x,
      healthBarY - gameState.camera.position.y,
      healthBarWidth,
      3,
    );
    ctx.strokeRect(
      healthBarX - gameState.camera.position.x,
      healthBarY - gameState.camera.position.y,
      healthBarWidth,
      3,
    );
    ctx.restore();
  }

  drawEntities(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < gameState.entities.length; i++) {
      const entity = gameState.entities[i];
      const sourceTileSize = ENTITY_DEFINITIONS[entity.type].tileSize ?? 16;

      if (entity.data.hidden || entity.inInventory) {
        continue;
      }

      if (entity.animator) {
        DrawHelper.drawAnimatedEntity(ctx, entity, sourceTileSize);
      } else if (entity.sprite && !entity.inInventory) {
        DrawHelper.drawEntity(ctx, entity, sourceTileSize);
      }

      if (entity.health.current < entity.health.max) {
        this.drawEntityHealthBar(ctx, entity);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawEntities(ctx);
  }
}
