import Draw from "../helpers/draw-helper";

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

const gizmoRects: GizmoRect[] = [];
const gizmoCircles: GizmoCircle[] = [];

export const Gizmos = {
    drawRect(rect: GizmoRect) {
        gizmoRects.push(rect);
    },

    drawCircle(circle: GizmoCircle) {
        gizmoCircles.push(circle);
    },

    clear() {
        gizmoRects.length = 0;
        gizmoCircles.length = 0;
    },

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();

        for (const rect of gizmoRects) {
            Draw.drawWireSquare(
                ctx,
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                rect.color ?? "green"
            );
        }

        for (const circle of gizmoCircles) {
            Draw.drawWireCircle(
                ctx,
                circle.x,
                circle.y,
                circle.radius,
                circle.radius,
                circle.color ?? "blue"
            );
        }

        ctx.restore();
    }
};
