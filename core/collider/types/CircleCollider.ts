import type { ComponentOptions } from "../../gears/component/component";
import type { Collider } from "./Collider";

export type CircleColliderOptions = ComponentOptions<CircleColliderComponent>;

export interface CircleColliderComponent extends Collider {
  radius: number;
  
}