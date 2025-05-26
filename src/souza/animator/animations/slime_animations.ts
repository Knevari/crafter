import type { AnimationClip } from "../../types/animation";
import { createAnimationClip } from "../../types/create-animation-clip";

export const SLIME_IDLE_CLIP: AnimationClip = createAnimationClip(
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

export const SLIME_MOVE_CLIP: AnimationClip = createAnimationClip(
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

export const SLIME_DEAD_CLIP: AnimationClip = createAnimationClip(
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











export const SLIME_GREEN_IDLE_CLIP: AnimationClip = createAnimationClip(
  "idle",
  "slimeGreen_img",
  4,
  0,
  0,
  64,
  64,
  12,
);

export const SLIME_GREEN_MOVE_CLIP: AnimationClip = createAnimationClip(
  "move",
  "slimeGreen_img",
  8,
  0,
  64,
  64,
  64,
  12,
);

export const SLIME_GREEN_DEAD_CLIP: AnimationClip = createAnimationClip(
  "dead",
  "slimeGreen_img",
  8,
  0,
  128,
  64,
  64,
  12
);