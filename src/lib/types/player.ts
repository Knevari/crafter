import type { Direction, Entity } from "./entity";

export interface Player extends Entity {
  data: {
    speed: number;
    moving: boolean;
    attacking: boolean;
    direction: Direction;
    lockedDirection: Direction | null;
  };
}
