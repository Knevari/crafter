import { Types } from "../../engine/TwoD";
import { WATER_ANIMATION } from "../animations/water.animations";


export const WATER_ANIMATOR_CONTROLLER: Types.AnimatorController = {

    name: "waterController",
    currentState: "idle",

    states: {
        idle: {
            clip: WATER_ANIMATION,
            loop: true,
        }
    }
};
