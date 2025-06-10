import type { Sprite } from "../types/sprite";

export const MUSHROOM_MATURE: Sprite = {
    textureRef: "grassFlowersMushrooms",
    width: 16, 
    height: 16,
    originX: 0.5,
    originY: 0.5,
    x:  128,
    y: 64  + 16
}

export const MUSHROOM_GROWING: Sprite = {
    textureRef: "grassFlowersMushrooms",
    width: 16, 
    height: 16,
    originX: 0.5,
    originY: 0.5,
    x:  128,
    y: 64  + 32
}

export const MUSHROOM_SEEDLING: Sprite = {
    textureRef: "grassFlowersMushrooms",
    width: 16, 
    height: 16,
    originX: 0.5,
    originY: 0.5,
    x:  128,
    y: 64  + 32 + 16
}