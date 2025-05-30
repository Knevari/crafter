import type { Collider } from "../collider/collider";

export interface CollisionEvent {
    a: Collider;
    b: Collider;
}

export interface TriggerEvent {
    a: Collider;
    b: Collider;
}