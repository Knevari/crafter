import type { Vec2 } from "../Vec2/Vec2";

export default class Display {

    public static ctx: CanvasRenderingContext2D;
    private static _width: number = 0;
    private static _height: number = 0;

    public static get width() {
        return Display._width;
    }
    public static get height() {
        return Display._height;
    }

    public static setDimensions(width: number, height: number): void {
        this._width = width;
        this._height = height;
    }
    public static getDimensions(): Vec2 {
        return { x: this._width, y: this._height };
    }

    public static getAspectRatio() {
        return this._width / this._height;
    }
    // public static screenToNDC(screenPoint: Vector3): Vector3 {
    //     if (this._width === 0 || this._height === 0) {
    //         throw new Error("WindowScreen dimensions are not set.");
    //     }
    //     const x_ndc = (2 * screenPoint.x / this._width) - 1;
    //     const y_ndc = 1 - (2 * screenPoint.y / this._height);
    //     return new Vector3(x_ndc, y_ndc, screenPoint.z);
    // }


    public static applyResolution(): void {
        this.setResolution(window.innerWidth, window.innerHeight)
    }

    public static setResolution(renderWidth: number, renderHeight: number) {
        const canvas = this.ctx.canvas as HTMLCanvasElement;

        canvas.width = renderWidth;
        canvas.height = renderHeight;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        Display.setDimensions(renderWidth, renderHeight);
    }

}
