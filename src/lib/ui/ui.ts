import { createHealthBar } from "./create-health-bar";
import { createInventory } from "./create-inventory";

interface BaseUIUpdater {
  update(): void;
}

export class UI {
  healthBar: BaseUIUpdater;
  inventory: BaseUIUpdater;

  constructor() {
    this.healthBar = createHealthBar();
    this.inventory = createInventory();

    const uiWrapper = document.querySelector("#ui") as HTMLDivElement;

    uiWrapper.onclick = (event: MouseEvent) => {
      event.preventDefault();
    };
  }

  render() {
    this.healthBar.update();
    this.inventory.update();
  }
}
