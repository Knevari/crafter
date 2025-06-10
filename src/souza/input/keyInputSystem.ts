import type { System } from "../types/system";
import KeyInput from "./KeyInput";

export function KeyInputSystem(): System {
    return {
        start(ecs) {
            KeyInput.initialize();
        },
        latedUpdate(ecs) {
            KeyInput.clear();
        },
    }
}