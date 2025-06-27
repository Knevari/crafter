import type { Vec2 } from "../../../Vec2/Vec2";

export interface MouseInputState {
    readonly button: Map<number, boolean>;
    readonly buttonDown: Map<number, boolean>;
    readonly buttonUp: Map<number, boolean>;
    position: Vec2;
    movement: Vec2;
    scrollDelta: Vec2;
    scrollCallback: ((delta: Vec2) => void) | null;
}

