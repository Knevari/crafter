import type { Vec2 } from "../../../Vec2/Vec2";
import type { Collider as Collider } from "../../../collider/types/Collider";
import type { ComponentOptions } from "../../component/component";


export type BoxColliderOptions = ComponentOptions<BoxColliderComponent>;
export interface BoxColliderComponent extends Collider {
  size: Vec2;   
}
