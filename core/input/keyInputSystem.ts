import type { System } from "../ecs/system";
import KeyInput from "./KeyInput";

export function KeyInputSystem(): System {
    return {
        start(ecs) {
            KeyInput.initialize();
        },
        lateUpdate(ecs) {
            KeyInput.clear();
        },
    }
}