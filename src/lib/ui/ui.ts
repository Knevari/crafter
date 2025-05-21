import { createHealthBar } from "./create-health-bar";
import { createInventory } from "./create-inventory";
import { createAnimatedText } from "./create-animated-text";

interface AnimatedTextUpdater {
  setText(textString: string): void;
  setPosition(worldX: number, worldY: number): void;
  fadeIn(): void;
  fadeOut(): void;
}

interface BaseUIUpdater {
  update(): void;
}

const stringDictionary = {
  openCraftingTable: createAnimatedText("Press E to open"),
  savedGame: createAnimatedText("Saved Game Progress"),
};

export class UI {
  static healthBar: BaseUIUpdater = createHealthBar();
  static inventory: BaseUIUpdater = createInventory();
  static text: Record<string, AnimatedTextUpdater> = stringDictionary;

  static render() {
    this.healthBar.update();
    this.inventory.update();
  }
}

const uiWrapper = document.querySelector("#ui") as HTMLDivElement;

uiWrapper.onclick = (event: MouseEvent) => {
  event.preventDefault();
};
