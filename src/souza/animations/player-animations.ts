import type { AnimationClip } from "../types/animation";
import { createAnimationClip } from "../types/create-animation-clip";

export const PLAYER_IDLE_DOWN_CLIP: AnimationClip = createAnimationClip(
  "idle",
  "player_img",
  6,
  0,
  0,
  32,
  32,
  12,
);



export const PLAYER_WALK_UP_CLIP: AnimationClip = createAnimationClip(
  "walk_back",
  "player_img",
  6,
  0,
  96,
  32,
  32,
  12,
);

export const PLAYER_WALK_SIDE_CLIP: AnimationClip = createAnimationClip(
  "walk_side",
  "player_img",
  6,
  0,
  128,
  32,
  32,
  12,
);

export const PLAYER_WALK_DOWN_CLIP: AnimationClip = createAnimationClip(
  "walk_front",
  "player_img",
  6,
  0,
  160,
  32,
  32,
  12,
);

export const PLAYER_ATTACK_DOWN_CLIP: AnimationClip = createAnimationClip(
  "attack_down",
  "player_img",
  4,
  0,
  192,
  32,
  32,
  12
);

export const PLAYER_ATTACK_UP_CLIP: AnimationClip = createAnimationClip(
  "attack_up",
  "player_img",
  4,
  0,
  256,
  32,
  32,
  12
);

export const PLAYER_ATTACK_SIDE_CLIP: AnimationClip = createAnimationClip(
  "attack_side",
  "player_img",
  4,
  0,
  224,
  32,
  32,
  12
);

