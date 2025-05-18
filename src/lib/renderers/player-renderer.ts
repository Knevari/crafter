import { PLAYER_SIZE, PLAYER_TILESET_TILE_SIZE } from "../constants";
import { gameState } from "../game-state";
import { DrawHelper } from "./draw-helper";

export class PlayerRenderer {
  drawPlayer(ctx: CanvasRenderingContext2D) {
    const drawX =
      gameState.player.position.x -
      PLAYER_SIZE / 2 -
      gameState.camera.position.x;
    const drawY =
      gameState.player.position.y -
      PLAYER_SIZE / 2 -
      gameState.camera.position.y;

    DrawHelper.drawAnimatedSpriteAt(
      ctx,
      gameState.player,
      PLAYER_TILESET_TILE_SIZE,
      drawX,
      drawY,
      PLAYER_SIZE,
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawPlayer(ctx);
  }
}
