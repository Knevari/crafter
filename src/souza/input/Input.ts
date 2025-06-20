import type { Vec2 } from "../Vec2/Vec2";
import { KeyCode } from "./KeyCode";
import KeyInput from "./KeyInput";
import MouseInput from "./MouseInput";

export default class Input {
    public static start(): void {
        KeyInput.initialize();
        MouseInput.initialize();
    }

    public static clearInputs(): void {
        KeyInput.clear();
        MouseInput.clear();
    }

    public static get mousePosition(): Vec2 {
        return MouseInput.getPosition();
    }

    public static get mouseDelta(): Vec2 {
        return MouseInput.getMovement();
    }


    public static onScroll(callback: (delta: { x: number, y: number }) => void): void {
        MouseInput.onScroll(callback);
    }

    public static getKeyDown(key: KeyCode): boolean {
        return KeyInput.getKeyDown(key);
    }
    public static getKey(key: KeyCode): boolean {
        return KeyInput.getKey(key);
    }
    public static getKeyUp(key: KeyCode): boolean {
        return KeyInput.getKeyUp(key);
    }

    public static getMouseButtonDown(button: number): boolean {
        return MouseInput.getMouseButtonDown(button);
    }
    public static getMouseButton(button: number): boolean {
        return MouseInput.getMouseButton(button);
    }
    public static getMouseButtonUp(button: number): boolean {
        return MouseInput.getMouseButtonUp(button);
    }
}
