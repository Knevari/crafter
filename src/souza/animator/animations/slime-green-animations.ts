import type { AnimationClip } from "../../types/animation";
import { createAnimationClip } from "../../types/create-animation-clip";

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