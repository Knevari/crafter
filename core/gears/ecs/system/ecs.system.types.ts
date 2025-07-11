import type { CollisionEvent, TriggerEvent } from "../../../types/collision-event";

export interface ECSSystemState {
  readonly systems: System[];
}

export interface System {
  start?: () => void;
  update?: () => void;
  fixedUpdate?: () => void;
  lateUpdate?: () => void;
  render?: () => void;
  onDrawGizmos?: () => void;

  onCollisionEnter?: (collisionEvent: CollisionEvent) => void;
  onCollisionStay?: (collisionEvent: CollisionEvent) => void;
  onCollisionExit?: (collisionEvent: CollisionEvent) => void;

  onTriggerEnter?: (triggerEvent: TriggerEvent) => void;
  onTriggerStay?: (triggerEvent: TriggerEvent) => void;
  onTriggerExit?: (triggerEvent: TriggerEvent) => void;
}