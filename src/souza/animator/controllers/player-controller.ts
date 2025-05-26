import { PLAYER_IDLE_DOWN_CLIP, PLAYER_WALK_DOWN_CLIP, PLAYER_WALK_UP_CLIP, PLAYER_WALK_SIDE_CLIP, PLAYER_ATTACK_DOWN_CLIP, PLAYER_ATTACK_UP_CLIP, PLAYER_ATTACK_SIDE_CLIP } from "../animations/player-animations";
import type { AnimatorController } from "../../types/animator";

export const PLAYER_CONTROLLER: AnimatorController = {
  name: "playerController",
  currentState: "idle",
  states: {
    idle: {
      clip: PLAYER_IDLE_DOWN_CLIP,
      loop: true
    },
    walk_front: {
      clip: PLAYER_WALK_DOWN_CLIP,
      loop: true
    },
    walk_back: {
      clip: PLAYER_WALK_UP_CLIP,
      loop: true
    },
    walk_side: {
      clip: PLAYER_WALK_SIDE_CLIP,
      loop: true
    },
    attack_down: {
      clip: PLAYER_ATTACK_DOWN_CLIP,
      loop: false
    },
    attack_up: {
      clip: PLAYER_ATTACK_UP_CLIP,
      loop: false
    },
    attack_side: {
      clip: PLAYER_ATTACK_SIDE_CLIP,
      loop: false
    },
  }
};