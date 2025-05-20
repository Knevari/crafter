import { getTilesetReferenceByEntityType } from "../assets";
import { TILESET_TILE_SIZE } from "../constants";
import { engine } from "../engine";
import { ENTITY_DEFINITIONS } from "../entity-defs";
import { gameState } from "../game-state";

const ITEM_SIZE = 60;

export function createInventory() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("inventory-wrapper");

  const slots: HTMLDivElement[] = [];

  for (let i = 0; i < 5; i++) {
    const slot = document.createElement("div");
    slot.classList.add("inventory-item");

    slots.push(slot);
    wrapper.appendChild(slot);
  }

  document.querySelector("#ui")?.appendChild(wrapper);

  const handleSlotClick = (index: number) => () => {
    if (gameState.selectedItemIndex !== -1) {
      slots[gameState.selectedItemIndex].classList.remove("active");
    }
    slots[index].classList.add("active");
    gameState.selectedItemIndex = index;
  };

  window.addEventListener("keydown", (event) => {
    if (["1", "2", "3", "4", "5"].indexOf(event.key) > -1) {
      const index = parseInt(event.key);
      const toggleSlotFunction = handleSlotClick(index - 1);
      toggleSlotFunction();
    }
  });

  return {
    update() {
      const inventoryItems = gameState.inventory;

      for (let index = 0; index < inventoryItems.length; index++) {
        const item = inventoryItems[index];
        const imgCanvas = document.createElement("canvas") as HTMLCanvasElement;
        const imgCtx = imgCanvas.getContext("2d") as CanvasRenderingContext2D;

        imgCanvas.width = ITEM_SIZE / 2;
        imgCanvas.height = ITEM_SIZE / 2;

        const sprite = item.entity.sprite;
        if (sprite) {
          const tileset = getTilesetReferenceByEntityType(item.entity.type);
          const sourceSize =
            ENTITY_DEFINITIONS[item.entity.type].tileSize ?? TILESET_TILE_SIZE;

          imgCtx.drawImage(
            tileset,
            sprite.sourceX * sourceSize,
            sprite.sourceY * sourceSize,
            sprite.sourceW * sourceSize,
            sprite.sourceH * sourceSize,
            0,
            0,
            ITEM_SIZE / 2,
            ITEM_SIZE / 2,
          );

          const img = new Image();
          img.src = imgCanvas.toDataURL();

          slots[index].innerHTML = "";
          slots[index].appendChild(img);

          const slotText = document.createElement("span");
          slotText.classList.add("inventory-item-amount");
          slotText.textContent = `x${item.amount}`;

          slots[index].appendChild(slotText);
          slots[index].onclick = handleSlotClick(index);
        }
      }
    },
  };
}
