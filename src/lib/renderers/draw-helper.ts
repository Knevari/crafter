import {
  getTilesetReferenceByEntityType,
  getTilesetReferenceByTileType,
} from "../assets";
import {
  PIG_TILESET_TILE_SIZE,
  TILE_SIZE,
  TILESET_TILE_SIZE,
} from "../constants";
import { gameState } from "../game-state";
import { tileSprites } from "../tiles";
import { type Entity, type Tile } from "../types";

export class DrawHelper {
  static drawEntity(ctx: CanvasRenderingContext2D, entity: Entity) {
    ctx.save();

    if (gameState.hoveredEntityId === entity.id) {
      ctx.globalAlpha = 0.5;
    }

    if (entity.sprite) {
      ctx.drawImage(
        getTilesetReferenceByEntityType(entity.type),
        entity.sprite.sourceX * TILESET_TILE_SIZE,
        entity.sprite.sourceY * TILESET_TILE_SIZE,
        entity.sprite.sourceW * TILESET_TILE_SIZE,
        entity.sprite.sourceH * TILESET_TILE_SIZE,
        entity.position.x - gameState.camera.position.x,
        entity.position.y - gameState.camera.position.y,
        entity.dimensions.width * TILE_SIZE,
        entity.dimensions.height * TILE_SIZE,
      );
    }

    ctx.restore();
  }

  static drawAnimatedEntity(ctx: CanvasRenderingContext2D, entity: Entity) {
    return this.drawAnimatedSprite(ctx, entity, PIG_TILESET_TILE_SIZE);
  }

  static drawEntityAt(
    ctx: CanvasRenderingContext2D,
    entity: Entity,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    ctx.save();

    if (gameState.hoveredEntityId === entity.id) {
      ctx.globalAlpha = 0.5;
    }

    if (entity.sprite) {
      ctx.drawImage(
        getTilesetReferenceByEntityType(entity.type),
        entity.sprite.sourceX * TILESET_TILE_SIZE,
        entity.sprite.sourceY * TILESET_TILE_SIZE,
        entity.sprite.sourceW * TILESET_TILE_SIZE,
        entity.sprite.sourceH * TILESET_TILE_SIZE,
        x,
        y,
        w,
        h,
      );
    }

    ctx.restore();
  }

  static drawTile(
    ctx: CanvasRenderingContext2D,
    tile: Tile,
    x: number,
    y: number,
  ) {
    const sprite = tileSprites[tile];
    ctx.drawImage(
      getTilesetReferenceByTileType(tile),
      sprite.sourceX * TILESET_TILE_SIZE,
      sprite.sourceY * TILESET_TILE_SIZE,
      sprite.sourceW * TILESET_TILE_SIZE,
      sprite.sourceH * TILESET_TILE_SIZE,
      x,
      y,
      sprite.sourceW * TILE_SIZE,
      sprite.sourceH * TILE_SIZE,
    );
  }

  static drawAnimatedSprite(
    ctx: CanvasRenderingContext2D,
    entity: Entity,
    tileSize: number,
  ) {
    const drawX = entity.position.x - gameState.camera.position.x;
    const drawY = entity.position.y - gameState.camera.position.y;
    return this.drawAnimatedSpriteAt(ctx, entity, tileSize, drawX, drawY);
  }

  static drawAnimatedSpriteAt(
    ctx: CanvasRenderingContext2D,
    entity: Entity,
    tileSize: number,
    drawX: number,
    drawY: number,
    finalSize: number = TILE_SIZE,
  ) {
    if (!entity.animator) {
      return;
    }

    const anim =
      entity.animator.animations[
        entity.animator.current as keyof typeof entity.animator.animations
      ];

    const sx = entity.animator.frame * tileSize;
    const sy = anim.row * tileSize;

    const animationDirection =
      gameState.player.data.lockedDirection ?? gameState.player.data.direction;

    if (animationDirection && animationDirection === "left") {
      ctx.save();
      // Translate to the center of the sprite
      ctx.translate(drawX + finalSize / 2, drawY + finalSize / 2);
      ctx.scale(-1, 1);

      // Now draw centered using negative offset (because of the flip)
      ctx.drawImage(
        // Hacky way of figuring out which tileset to use
        getTilesetReferenceByEntityType(entity.type),
        sx,
        sy,
        tileSize,
        tileSize,
        -TILE_SIZE / 2,
        -TILE_SIZE / 2,
        finalSize,
        finalSize,
      );
      ctx.restore();
    } else {
      // Normal draw
      ctx.drawImage(
        getTilesetReferenceByEntityType(entity.type),
        sx,
        sy,
        tileSize,
        tileSize,
        drawX,
        drawY,
        finalSize,
        finalSize,
      );
    }
  }
}
