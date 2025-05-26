import type { BoxColliderComponent } from "./collider-box";

export interface CollisionEvent {
    a: BoxColliderComponent;
    b: BoxColliderComponent;
}