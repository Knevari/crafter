import type { CollisionEvent, TriggerEvent } from "../../../types/collision-event";
import type { ECSSystemState } from "./ecs.system.types";

export function callStart(state: ECSSystemState): void {
  for (const system of state.systems) {
    system.start?.();
  }
}

export function callFixedUpdate(state: ECSSystemState): void {
  for (const system of state.systems) {
    system.fixedUpdate?.();
  }
}

export function callUpdate(state: ECSSystemState): void {
  for (const system of state.systems) {
    system.update?.();
  }
}

export function callLateUpdate(state: ECSSystemState): void {
  for (const system of state.systems) {
    system.lateUpdate?.();
  }
}

export function callRender(state: ECSSystemState): void {
  for (const system of state.systems) {
    system.render?.();
  }
}

export function callDrawGizmos(state: ECSSystemState): void {
  for (const system of state.systems) {
    system.onDrawGizmos?.();
  }
}

export function callCollisionEnterEvents(state: ECSSystemState, event: CollisionEvent): void {
  for (const system of state.systems) {
    system.onCollisionEnter?.(event);
  }
}

export function callCollisionStayEvents(state: ECSSystemState, event: CollisionEvent): void {
  for (const system of state.systems) {
    system.onCollisionStay?.(event);
  }
}

export function callCollisionExitEvents(state: ECSSystemState, event: CollisionEvent): void {
  for (const system of state.systems) {
    system.onCollisionExit?.(event);
  }
}

export function callTriggerEnterEvents(state: ECSSystemState, event: TriggerEvent): void {
  for (const system of state.systems) {
    system.onTriggerEnter?.(event);
  }
}

export function callTriggerStayEvents(state: ECSSystemState, event: TriggerEvent): void {
  for (const system of state.systems) {
    system.onTriggerStay?.(event);
  }
}

export function callTriggerExitEvents(state: ECSSystemState, event: TriggerEvent): void {
  for (const system of state.systems) {
    system.onTriggerExit?.(event);
  }
}