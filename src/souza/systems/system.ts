import type { ECSComponents } from "../ecs-components";

export interface System {
    priority?: number,
    update?: (ecs: ECSComponents, deltaTime: number) => void;
}
