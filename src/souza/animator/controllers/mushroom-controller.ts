import type { AnimatorController } from "../../types/animator";
import { MUSHROOM_IDLE_CLIP, MUSHROOM_RUN_CLIP } from "../animations/mushroom-animations";

export const MUSHROOM_CONTROLLER: AnimatorController = {

    name: "mushroomController",
    currentState: "idle",
    syncCollider: true,
    states: {
        idle: {
            clip: MUSHROOM_IDLE_CLIP,
            loop: true,
        },
        move: {
            clip: MUSHROOM_RUN_CLIP,
            loop: true,
        },

    },
};
