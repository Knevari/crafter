import type { AnimationClip } from "../types/animation";

export const PLAYER_WALK_UP_CLIP: AnimationClip = {
  name: "walk_back",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 96, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 96, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 96, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 96, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 128, y: 96, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 160, y: 96, width: 32, height: 32 } },
  ],
  loop: true,
  frameRate: 12,
};


export const PLAYER_WALK_DOWN_CLIP: AnimationClip = {
  name: "walk_front",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 160, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 160, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 160, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 160, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 128, y: 160, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 160, y: 160, width: 32, height: 32 } },
  ],
  loop: true,
  frameRate: 12,
};


export const PLAYER_WALK_SIDE_CLIP: AnimationClip = {
  name: "walk_side",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 128, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 128, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 128, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 128, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 128, y: 128, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 160, y: 128, width: 32, height: 32 } },
  ],
  loop: true,
  frameRate: 12,
};

export const PLAYER_IDLE_DOWN_CLIP: AnimationClip = {
  name: "idle",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 128, y: 0, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 160, y: 0, width: 32, height: 32 } },
  ],
  loop: true,
  frameRate: 12,
};



export const PLAYER_ATTACK_DOWN_CLIP: AnimationClip = {
  name: "attack_down",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 192, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 192, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 192, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 192, width: 32, height: 32 } },
  ],
  loop: false,
  frameRate: 10,
};


//atack
export const PLAYER_ATTACK_UP_CLIP: AnimationClip = {
  name: "attack_up",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 256, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 256, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 256, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 256, width: 32, height: 32 } },
  ],
  loop: false,
  frameRate: 10,
};

export const PLAYER_ATTACK_LEFT_CLIP: AnimationClip = {
  name: "attack_left",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 256, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 256, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 256, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 256, width: 32, height: 32 } },
  ],
  loop: false,
  frameRate: 10,
};

export const PLAYER_ATTACK_SIDE_CLIP: AnimationClip = {
  name: "attack_side",
  frames: [
    { sprite: { textureRef: "player_img", x: 0, y: 224, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 32, y: 224, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 64, y: 224, width: 32, height: 32 } },
    { sprite: { textureRef: "player_img", x: 96, y: 224, width: 32, height: 32 } },
  ],
  loop: false,
  frameRate: 10,
};

