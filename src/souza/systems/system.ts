import type ECSComponents from "../ecs";

export interface System {
    priority?: number,
    update?: (ecs: ECSComponents, deltaTime: number) => void;
}
