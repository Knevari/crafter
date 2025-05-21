import type { Sprite } from "./sprite";


export interface SpriteSheet {
  src: string;
  sprites: Record<string, Sprite>;
}
