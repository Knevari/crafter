import type { Dimensions, Position } from "./entity";
import type { Player } from "./player";

export interface Camera {
  position: Position;
  dimensions: Dimensions;
  target: Player;
}
