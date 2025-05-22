import type { AnimationClip } from "../types/animation";

export const SLIME_IDLE_CLIP: AnimationClip = {
  name: "idle",
  frames: [
    { sprite: { textureRef: "slime_img", x: 0, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 32, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 64, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 96, y: 0, width: 32, height: 32 } },
  ],
  loop: true,
  frameRate: 12,
};

export const SLIME_MOVE_CLIP: AnimationClip = {
  name: "move",
  frames: [
    { sprite: { textureRef: "slime_img", x: 0, y: 32, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 32, y: 32, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 64, y: 32, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 96, y: 32, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 128, y: 32, width: 32, height: 32 } },
    { sprite: { textureRef: "slime_img", x: 160, y: 32, width: 32, height: 32 } },
  ],
  loop: true,
  frameRate: 12,
};
