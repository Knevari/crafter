import type { ECSComponents } from "../ecs/ecs-components";

export interface System {
    priority?: number,
    update?: (ecs: ECSComponents, deltaTime: number) => void;
}
