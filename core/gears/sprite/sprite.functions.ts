import type { Sprite } from ".";
import type { Vec2 } from "../../Vec2/Vec2";

export function createSprite(texture: string, position: Vec2 = { x: 0, y: 0 }, size: Vec2 = { x: 32, y: 32 }, origin: Vec2 = { x: 0.5, y: 0.5 }): Sprite {
    return {
        textureName: texture,
        position: position,
        size: size,
        origin: origin,
        meshName: "global_square"
    }
}