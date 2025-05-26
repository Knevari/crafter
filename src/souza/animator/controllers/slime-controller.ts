import type { AnimatorController } from "../../types/animator";
import { SLIME_DEAD_CLIP, SLIME_IDLE_CLIP, SLIME_MOVE_CLIP } from "../animations/slime_animations";

export const SLIME_ANIMATOR_CONTROLLER: AnimatorController = {

  name: "slimeController",
  currentState: "idle",
  syncCollider: true,
  states: {
    idle: {
      clip: SLIME_IDLE_CLIP,
      loop: true,
    },
    move: {
      clip: SLIME_MOVE_CLIP,
      loop: true,
    },
    dead: {
      clip: SLIME_DEAD_CLIP,
      loop: false,
    },
  },
};
