import type { Collider as ICollider } from "./collider";

export interface BoxColliderComponent extends ICollider {
  width: number;     
  height: number;     

}
