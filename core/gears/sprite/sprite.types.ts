import type { Vec2 } from "../../Vec2/Vec2";

export interface Sprite {
  texture: string;
  position: Vec2;
  origin: Vec2;
  size: Vec2;
}
