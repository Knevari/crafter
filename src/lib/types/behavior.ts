import type { Entity } from "./entity";

export type Behavior = (entity: Entity, deltaTime: number) => void;
