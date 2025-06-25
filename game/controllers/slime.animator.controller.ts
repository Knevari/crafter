import { Components } from "../../engine/TwoD";
import { SLIME_ANIMATIONS } from "../animations/slime.animations";

export const SLIME_ANIMATOR_CONTROLLER: Components.Animator.AnimatorController = {

  name: "slimeController",
  currentState: "idle",
  syncCollider: true,
  states: {
    idle: {
      clip: SLIME_ANIMATIONS.SLIME_IDLE_CLIP,
      loop: true,
    },
    move: {
      clip: SLIME_ANIMATIONS.SLIME_MOVE_CLIP,
      loop: true,
    },
    dead: {
      clip: SLIME_ANIMATIONS.SLIME_DEAD_CLIP,
      loop: false,
    },
  },
};
