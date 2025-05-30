import type { GameEntity } from "./entity";

export type Behavior = (entity: GameEntity, deltaTime: number) => void;
