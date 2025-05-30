import type { Direction, GameEntity } from "./entity";

export interface Player extends GameEntity {
  data: {
    speed: number;
    moving: boolean;
    attacking: boolean;
    direction: Direction;
    lockedDirection: Direction | null;
  };
}
