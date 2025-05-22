import type { ECSComponents } from "../systems/ecs-components";

export interface System {
    priority?: number,
    update?: (ecs: ECSComponents, deltaTime: number) => void;
}
