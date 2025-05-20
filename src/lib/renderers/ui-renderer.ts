import { TILE_SIZE } from "../constants";
import { gameState } from "../game-state";
import { cursor } from "../input";
import { DrawHelper } from "./draw-helper";

export class UIRenderer {
  drawSelectedInventoryItem(ctx: CanvasRenderingContext2D) {
    if (gameState.selectedItemIndex === -1) return;
    const selectedItem = gameState.inventory[gameState.selectedItemIndex];
    if (!selectedItem) return;
    const size = TILE_SIZE / 1.5;
    DrawHelper.drawEntityAt(
      ctx,
      selectedItem.entity,
      cursor.x,
      cursor.y,
      size,
      size,
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawSelectedInventoryItem(ctx);
  }
}
