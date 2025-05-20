import { TILE_SIZE } from "../constants";
import { engine } from "../engine";
import { gameState } from "../game-state";
import { cursor } from "../input";
import { DrawHelper } from "./draw-helper";

export class UIRenderer {
  drawPlayerStats(ctx: CanvasRenderingContext2D) {
    const healthBarWidth = 265;
    const healthBarHeight = 30;

    const healthBarX = engine.canvas.width / 2 - healthBarWidth / 2;
    const healthBarY = engine.canvas.height - healthBarHeight * 5.5;

    ctx.beginPath();

    // Draw outline
    ctx.strokeStyle = "#1e2328";
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Draw Health Rect
    ctx.fillStyle = "#f74d4d";
    ctx.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth *
        (gameState.player.health.current / gameState.player.health.max),
      healthBarHeight,
    );

    // Draw Health Text
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(
      `${gameState.player.health.current}/${gameState.player.health.max}`,
      healthBarX + healthBarWidth / 2,
      healthBarY + healthBarHeight / 2,
    );

    ctx.closePath();
  }

  drawInventory(ctx: CanvasRenderingContext2D) {
    const slotSize = 60;
    const totalItemsSlots = 4;

    const padding = 8;

    const inventoryWidth =
      totalItemsSlots * slotSize + padding * (totalItemsSlots - 1);
    const inventoryX = engine.canvas.width / 2 - inventoryWidth / 2;
    const inventoryY = engine.canvas.height - slotSize * 2;

    let currentX = inventoryX;

    for (let i = 0; i < totalItemsSlots; i++) {
      ctx.save();

      ctx.strokeStyle = "black";
      ctx.strokeRect(currentX + i * slotSize, inventoryY, slotSize, slotSize);
      ctx.font = "12px Arial";

      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // Draw item inside slot
      const item = gameState.inventory[i];

      if (item) {
        const itemX = currentX + i * slotSize + slotSize * 0.15;
        const itemY = inventoryY + slotSize * 0.15;
        const itemSize = slotSize * 0.7;

        DrawHelper.drawEntityAt(
          ctx,
          item.entity,
          itemX,
          itemY,
          itemSize,
          itemSize,
        );

        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillText(`x${item.amount}`, itemX + itemSize, itemY + itemSize);
        ctx.restore();
      }

      ctx.restore();
      currentX += padding;
    }
  }

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
    // this.drawInventory(ctx);
    this.drawSelectedInventoryItem(ctx);
    // this.drawPlayerStats(ctx);
  }
}
