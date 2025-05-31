import { ecs } from "../app";
import Draw from "../helpers/draw-helper";
import type { CameraComponent } from "../types/camera";
import { ComponentType } from "../types/component-type";

export type GizmoRect = {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
};

export type GizmoCircle = {
    x: number;
    y: number;
    radius: number;
    color?: string;
};
export type GizmoText = {
    x: number;
    y: number;
    text: string;
    color?: string;
    font?: string;
};

const gizmoRects: GizmoRect[] = [];
const gizmoCircles: GizmoCircle[] = [];
const gizmoTexts: GizmoText[] = [];

export const Gizmos = {
    drawRect(rect: GizmoRect) {
        gizmoRects.push(rect);
    },
    drawText(text: GizmoText) {
        gizmoTexts.push(text);
    },
    drawCircle(circle: GizmoCircle) {
        gizmoCircles.push(circle);
    },

    clear() {
        gizmoRects.length = 0;
        gizmoCircles.length = 0;
        gizmoTexts.length = 0;
    },

    render(ctx: CanvasRenderingContext2D) {

        const camera = ecs.getSingletonComponent<CameraComponent>(ComponentType.CAMERA);
        if (!camera) return;

        ctx.save();
     
        for (const rect of gizmoRects) {
            Draw.drawWireSquare(
                ctx,
                rect.x - camera.x,
                rect.y - camera.y,
                rect.width,
                rect.height,
                rect.color ?? "green"
            );
        }

        for (const circle of gizmoCircles) {
            Draw.drawWireCircle(
                ctx,
                circle.x - camera.x,
                circle.y - camera.y,
                circle.radius,
                circle.radius,
                circle.color ?? "blue"
            );
        }
        for (const txt of gizmoTexts) {
            Draw.drawText(
                ctx,
                txt.text,
                txt.x - camera.x,
                txt.y - camera.y,
            );
        }
        ctx.restore();
    }
};
