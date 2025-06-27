import type { Vec2 } from "../../../Vec2/Vec2";
import type { MouseInputState } from "./mouse.input.types";

export function attachMouseInputListeners(state: MouseInputState): void {
    document.addEventListener('mousedown', (e) => handleButtonDown(state, e));
    document.addEventListener('mouseup', (e) => handleButtonUp(state, e));
    document.addEventListener('mousemove', (e) => handleMouseMove(state, e));
    document.addEventListener('wheel', (e) => handleScroll(state, e));
}

export function createMouseInputState(): MouseInputState {
    return {
        button: new Map<number, boolean>(),
        buttonDown: new Map<number, boolean>(),
        buttonUp: new Map<number, boolean>(),
        position: { x: 0, y: 0 },
        movement: { x: 0, y: 0 },
        scrollDelta: { x: 0, y: 0 },
        scrollCallback: null,
    };
}

function handleButtonDown(state: MouseInputState, e: MouseEvent): void {
    if (!state.button.get(e.button)) {
        state.button.set(e.button, true);
        state.buttonDown.set(e.button, true);
    }
}

function handleButtonUp(state: MouseInputState, e: MouseEvent): void {
    state.button.set(e.button, false);
    state.buttonUp.set(e.button, true);
}

function handleMouseMove(state: MouseInputState, e: MouseEvent): void {
    state.position = { x: e.clientX, y: e.clientY };
    state.movement = { x: e.movementX, y: e.movementY };
}

function handleScroll(state: MouseInputState, e: WheelEvent): void {
    state.scrollDelta = { x: e.deltaX, y: e.deltaY };
    if (state.scrollCallback) {
        state.scrollCallback(state.scrollDelta);
    }
}

export function clearMouseInput(state: MouseInputState): void {
    state.buttonDown.clear();
    state.buttonUp.clear();
    state.movement = { x: 0, y: 0 };
    state.scrollDelta = { x: 0, y: 0 };
}

export function getMouseButtonDown(state: MouseInputState, button: number): boolean {
    return state.buttonDown.get(button) ?? false;
}

export function getMouseButton(state: MouseInputState, button: number): boolean {
    return state.button.get(button) ?? false;
}

export function getMouseButtonUp(state: MouseInputState, button: number): boolean {
    return state.buttonUp.get(button) ?? false;
}

export function getMousePosition(state: MouseInputState): Vec2 {
    return state.position;
}

export function getMouseMovement(state: MouseInputState): Vec2 {
    return state.movement;
}

export function getScrollDelta(state: MouseInputState): Vec2 {
    return state.scrollDelta;
}

export function onMouseScroll(state: MouseInputState, callback: (delta: Vec2) => void): void {
    state.scrollCallback = callback;
}
