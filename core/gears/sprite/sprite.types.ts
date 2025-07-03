import type { Vec2 } from "../../Vec2/Vec2";

export interface Sprite {
  textureName: string;
  position: Vec2;
  origin: Vec2;
  size: Vec2;
  meshName: string | null;
}
