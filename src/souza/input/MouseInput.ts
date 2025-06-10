import type { Vec2 } from "../Vec2/Vec2";

const VECTOR3_ZERO: Vec2 = { x: 0, y: 0 }

export default class MouseInput {
    private static readonly buttonState = new Map<number, boolean>();
    private static readonly buttonDown = new Map<number, boolean>();
    private static readonly buttonUp = new Map<number, boolean>();
    private static position: Vec2 = VECTOR3_ZERO;
    private static movement: Vec2 = VECTOR3_ZERO;
    private static scrollDelta: Vec2 = VECTOR3_ZERO;
    private static scrollCallback: ((delta: { x: number, y: number }) => void) | null = null;

    public static initialize(): void {
        // const canvas = document.getElementById('canvas') as HTMLCanvasElement;

        document.addEventListener('mousedown', this.handleButtonDown.bind(this));
        document.addEventListener('mouseup', this.handleButtonUp.bind(this));
        document.addEventListener('mousemove', (e) => {
            // const rect = canvas.getBoundingClientRect();
            // MouseInput.position = {x: e.clientX - rect.left, y: e.clientY - rect.top, z: 0};
            MouseInput.position = { x: e.clientX, y: e.clientY };
            MouseInput.movement = { x: e.movementX, y: e.movementY };

        });
        document.addEventListener('wheel', this.handleScroll.bind(this));
    }

    public static clear(): void {
        this.buttonDown.clear();
        this.buttonUp.clear();
        MouseInput.movement = VECTOR3_ZERO;
        MouseInput.scrollDelta = VECTOR3_ZERO;
    }

    public static getMouseButtonDown(button: number): boolean {
        return this.buttonDown.get(button) ?? false;
    }

    public static getMouseButton(button: number): boolean {
        return this.buttonState.get(button) ?? false;
    }

    public static getMouseButtonUp(button: number): boolean {
        return this.buttonUp.get(button) ?? false;
    }

    private static handleButtonDown(e: MouseEvent): void {
        if (!this.buttonState.get(e.button)) {
            this.buttonState.set(e.button, true);
            this.buttonDown.set(e.button, true);
        }
    }

    private static handleButtonUp(e: MouseEvent): void {
        this.buttonState.set(e.button, false);
        this.buttonUp.set(e.button, true);
    }

    private static handleScroll(e: WheelEvent): void {
        MouseInput.scrollDelta = { x: e.deltaX, y: e.deltaY };
        if (MouseInput.scrollCallback) {
            MouseInput.scrollCallback(MouseInput.scrollDelta);
        }
    }

    public static getPosition() {
        return MouseInput.position;
    }

    public static getMovement() {
        return MouseInput.movement;
    }

    public static getScrollDelta() {
        return MouseInput.scrollDelta;
    }

    public static onScroll(callback: (delta: { x: number, y: number }) => void): void {
        MouseInput.scrollCallback = callback;
    }
}
