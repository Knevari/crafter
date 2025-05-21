import type { SpriteSheet } from "../types/sprite-sheet";

export class SpriteSheetManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpriteSheetManagerError";
  }
}

class SpriteSheetManager {
  private sheets = new Map<string, SpriteSheet>();

  register(sheet: SpriteSheet) {
    this.sheets.set(sheet.id, sheet);
  }

  get(id: string): SpriteSheet {
    const sheet = this.sheets.get(id);
    if (!sheet) throw new SpriteSheetManagerError(`SpriteSheet com o id "${id}" não foi encontrado.`);
    return sheet;
  }
}

export const spriteSheetManager = new SpriteSheetManager();
