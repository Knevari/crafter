import { gameState } from "./game-state";
import type { Entity } from "./types";

export function addToInventory(entity: Entity) {
  let itemInIventory = false;

  for (const item of gameState.inventory) {
    if (item.entity.type === entity.type) {
      itemInIventory = true;
      item.amount += 1;
    }
  }

  if (!itemInIventory) {
    entity.data.inventory = true;
    gameState.inventory.push({
      amount: 1,
      entity,
    });
  }
}
