import { createHealthBar } from "./create-health-bar";
import { createInventory } from "./create-inventory";

interface BaseUIUpdater {
  update(): void;
}

export class UI {
  static healthBar: BaseUIUpdater = createHealthBar();
  static inventory: BaseUIUpdater = createInventory();

  static render() {
    this.healthBar.update();
    this.inventory.update();
  }
}

const uiWrapper = document.querySelector("#ui") as HTMLDivElement;

uiWrapper.onclick = (event: MouseEvent) => {
  event.preventDefault();
};
