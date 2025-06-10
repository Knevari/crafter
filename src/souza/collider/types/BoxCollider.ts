import type { Vec2 } from "../../Vec2/Vec2";
import type { Collider as Collider } from "./Collider";

export interface BoxColliderComponent extends Collider {
  size: Vec2;   
}
