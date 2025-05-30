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
);