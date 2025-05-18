import { getChunkTopLeftCorner } from "../chunks";
import { CHUNK_SIZE, TILE_SIZE } from "../constants";
import { engine } from "../engine";
import { gameState } from "../game-state";
import { DrawHelper } from "./draw-helper";
import type { ChunkKey, Tile } from "../types";

export class MapRenderer {
  drawChunks(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = gameState.dayNightCycle.daylight ? 1 : 0.2;
    for (const [key, chunk] of Object.entries(gameState.chunks)) {
      const [cx, cy] = getChunkTopLeftCorner(key as ChunkKey);
      for (let i = 0; i < CHUNK_SIZE; i++) {
        for (let j = 0; j < CHUNK_SIZE; j++) {
          const x = cx + i * TILE_SIZE - gameState.camera.position.x;
          const y = cy + j * TILE_SIZE - gameState.camera.position.y;
          const tile = chunk[i][j];

          this.drawTile(ctx, tile, x, y);
        }
      }
    }

    ctx.restore();
  }

  drawTile(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number) {
    DrawHelper.drawTile(ctx, tile, x, y);
  }

  clearBackground(ctx: CanvasRenderingContext2D) {
    if (gameState.dayNightCycle.daylight) {
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.clearBackground(ctx);
    this.drawChunks(ctx);
  }
}
