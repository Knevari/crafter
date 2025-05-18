import { getChunkTopLeftCorner } from "../chunks";
import {
  CHUNK_SIZE,
  CHUNK_SIZE_IN_PIXELS,
  ITEM_PICKUP_RANGE,
  PLAYER_RANGE,
  PLAYER_SIZE,
  TILE_SIZE,
} from "../constants";
import { getEntityTypeAsString } from "../entities";
import { gameState } from "../game-state";
import { cursor } from "../input";
import type { ChunkKey } from "../types";

export class DebugRenderer {
  drawPlayerOutline(ctx: CanvasRenderingContext2D) {
    const outlineSize = 4;
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(
      gameState.player.position.x -
        PLAYER_SIZE / 2 -
        gameState.camera.position.x,
      gameState.player.position.y -
        PLAYER_SIZE / 2 -
        gameState.camera.position.y,
      PLAYER_SIZE,
      PLAYER_SIZE,
    );

    ctx.fillStyle = "red";
    ctx.fillRect(
      gameState.player.position.x -
        outlineSize / 2 -
        gameState.camera.position.x,
      gameState.player.position.y -
        outlineSize / 2 -
        gameState.camera.position.y,
      outlineSize,
      outlineSize,
    );
    ctx.restore();
  }

  drawPlayerRange(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#F5F5F5";
    ctx.beginPath();
    ctx.arc(
      gameState.player.position.x - gameState.camera.position.x,
      gameState.player.position.y - gameState.camera.position.y,
      PLAYER_RANGE * TILE_SIZE,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.closePath();
  }

  drawEntitiesHelper(ctx: CanvasRenderingContext2D) {
    for (const entity of gameState.entities) {
      const entityCenterX =
        entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2;
      const entityCenterY =
        entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2;

      ctx.save();
      ctx.beginPath();

      ctx.fillStyle = "red";

      ctx.arc(
        entityCenterX - gameState.camera.position.x,
        entityCenterY - gameState.camera.position.y,
        2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.closePath();

      // Bounds
      ctx.strokeStyle = "blue";
      ctx.fillStyle = "blue";

      ctx.strokeRect(
        entity.position.x - gameState.camera.position.x,
        entity.position.y - gameState.camera.position.y,
        entity.dimensions.width * TILE_SIZE,
        entity.dimensions.height * TILE_SIZE,
      );

      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.font = "16px Arial";

      ctx.fillText(
        `${getEntityTypeAsString(entity.type)} BOUNDS`,
        entity.position.x - gameState.camera.position.x,
        entity.position.y - gameState.camera.position.y,
      );

      // Pickup range
      if (getEntityTypeAsString(entity.type).startsWith("ITEM")) {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.arc(
          entityCenterX - gameState.camera.position.x,
          entityCenterY - gameState.camera.position.y,
          ITEM_PICKUP_RANGE * TILE_SIZE,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.closePath();

        ctx.fillText(
          `${getEntityTypeAsString(entity.type)} PICKUP RANGE`,
          entityCenterX -
            ITEM_PICKUP_RANGE * TILE_SIZE -
            gameState.camera.position.x,
          entityCenterY -
            ITEM_PICKUP_RANGE * TILE_SIZE -
            gameState.camera.position.y,
        );
      }

      ctx.restore();
    }
  }

  drawCursor(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#AC46CB";
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, cursor.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  drawHighlightedChunks(ctx: CanvasRenderingContext2D) {
    ctx.font = "16px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    for (const key of Object.keys(gameState.chunks)) {
      const [x, y] = getChunkTopLeftCorner(key as ChunkKey);
      ctx.strokeRect(
        x - gameState.camera.position.x,
        y - gameState.camera.position.y,
        CHUNK_SIZE * TILE_SIZE,
        CHUNK_SIZE * TILE_SIZE,
      );
      ctx.fillText(
        key,
        x + CHUNK_SIZE_IN_PIXELS / 2 - gameState.camera.position.x,
        y + CHUNK_SIZE_IN_PIXELS / 2 - gameState.camera.position.y,
      );
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawPlayerOutline(ctx);
    this.drawPlayerRange(ctx);
    this.drawEntitiesHelper(ctx);
    this.drawHighlightedChunks(ctx);
    this.drawCursor(ctx);
  }
}
