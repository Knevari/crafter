import type { Collider } from "../collider/types/Collider";

export interface CollisionEvent {
    a: Collider;
    b: Collider;
}

export interface TriggerEvent {
    a: Collider;
    b: Collider;
}