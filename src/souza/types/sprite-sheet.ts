import type { Animations } from "./animation";
import type { Sprite } from "./sprite";

export type SpriteMap = Record<string, Sprite>;
export interface SpriteSheet {
  id: string;
  imageId: string;
  sprites: SpriteMap;
}

export function getSpriteForFrame(
  spriteSheet: SpriteSheet,
  animations: Animations,
  animationName: string,
  frameIndex: number
) {
  const animation = animations[animationName];
  if (!animation) {
    throw new Error(`Animação "${animationName}" não encontrada.`);
  }
  const frames = animation.frames;
  if (frameIndex < 0 || frameIndex >= frames.length) {
    throw new Error(`Frame index ${frameIndex} fora do intervalo da animação "${animationName}".`);
  }

  const spriteName = frames[frameIndex].spriteName;
  const sprite = spriteSheet.sprites[spriteName];
  if (!sprite) {
    throw new Error(`Sprite "${spriteName}" não encontrado no SpriteSheet "${spriteSheet.id}".`);
  }

  return sprite; 
}