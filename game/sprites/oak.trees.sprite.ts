import type { Types } from "../../engine/TwoD";

export const OAK_TREE_1: Types.Sprite = {
    meshName: null,
    textureName: "oak_tree",
    origin: { x: 0.5, y: 0.9 },
    position: { x: 320, y: 0 },
    size: { x: 80, y: 128 },
}

export const OAK_TRE_0: Types.Sprite = {
    meshName: null,
    textureName: "oak_tree",
    origin: { x: 0.5, y: 0.82 },
    position: { x: 240, y: 0 },
    size: { x: 80, y: 128 },
}

export const OAK_TRE_SHADOW: Types.Sprite = {
    meshName: null,
    textureName: "oak_tree",
    position: { x: 128 + 32 + 16, y: 128 },
    size: { x: 80, y: 128 - 32 },
    origin: { x: 0.5, y: 0.6 },
}
