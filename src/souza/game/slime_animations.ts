import { createEasyAnimationClip, type AnimationClip } from "../types/animation";

export const SLIME_IDLE_CLIP: AnimationClip = createEasyAnimationClip(
  "idle",
  "slime_img",
  4,
  0,
  0,
  32,
  32,
  12,
   [
    { offsetX: 16, offsetY: 20, width: 32, height: 30, enabled: true },
    { offsetX: 16, offsetY: 20, width: 32, height: 30, enabled: true },
    { offsetX: 16, offsetY: 20, width: 32, height: 30, enabled: true },
    { offsetX: 16, offsetY: 20, width: 32, height: 30, enabled: true },
  ]
);

export const SLIME_MOVE_CLIP: AnimationClip = createEasyAnimationClip(
  "move",
  "slime_img",
  6,
  0,
  32,
  32,
  32,
  12,
  [
    { offsetX: 16, offsetY: 16, width: 24, height: 24, enabled: true },
    { offsetX: 16, offsetY: 16, width: 22, height: 22, enabled: true },
    { offsetX: 16, offsetY: 16, width: 24, height: 24, enabled: true },
    { offsetX: 16, offsetY: 16, width: 22, height: 22, enabled: true },
    { offsetX: 16, offsetY: 16, width: 26, height: 26, enabled: true },
    { offsetX: 16, offsetY: 16, width: 26, height: 26, enabled: true },
  ]
);

export const SLIME_DEAD_CLIP: AnimationClip = createEasyAnimationClip(
  "dead",
  "slime_img",
  5,
  0,
  64,
  32,
  32,
  12,
  [
    { offsetX: 16, offsetY: 16, width: 24, height: 24, enabled: true },
    { offsetX: 16, offsetY: 16, width: 22, height: 22, enabled: true },
    { offsetX: 16, offsetY: 16, width: 24, height: 24, enabled: true },
    { offsetX: 16, offsetY: 16, width: 22, height: 22, enabled: true },
    { offsetX: 16, offsetY: 16, width: 26, height: 26, enabled: true },
    { offsetX: 16, offsetY: 16, width: 26, height: 26, enabled: true },
  ]
);











export const SLIME_GREEN_IDLE_CLIP: AnimationClip = createEasyAnimationClip(
  "idle",
  "slimeGreen_img",
  4,
  0,
  0,
  64,
  64,
  12,
);

export const SLIME_GREEN_MOVE_CLIP: AnimationClip = createEasyAnimationClip(
  "move",
  "slimeGreen_img",
  8,
  0,
  64,
  64,
  64,
  12,
);

export const SLIME_GREEN_DEAD_CLIP: AnimationClip = createEasyAnimationClip(
  "dead",
  "slimeGreen_img",
  8,
  0,
  128,
  64,
  64,
  12
);