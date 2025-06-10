import type { ECSComponents } from "./ecs-components";
import type { System } from "../types/system";
import type { CollisionEvent, TriggerEvent } from "../types/collision-event";
import { engine2d } from "../Engine2d";

export class ECSSystems {
  private systems: System[] = [];
  private components: ECSComponents;

  constructor(components: ECSComponents) {
    this.components = components;
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  callStart(): void {
    for (const system of this.systems) {
      system.start?.(this.components);
    }
  }

  callFixedUpdate(): void {
    for (const system of this.systems) {
      system.fixedUpdate?.(this.components);
    }
  }

  callUpdate(): void {
    for (const system of this.systems) {
      system.update?.(this.components);
    }
  }

  callLatedUpdate(): void {
    for (const system of this.systems) {
      system.latedUpdate?.(this.components);
    }
  }

  callRender(): void {
    engine2d.clear();
    for (const system of this.systems) {
      system.render?.(this.components);
    }
  }

  callDrawGizmos(): void {
    for (const system of this.systems) {
      system.onDrawGizmos?.(this.components);
    }
  }

  callCollisionEnterEvents(collisionEvent: CollisionEvent) {
    for (const system of this.systems) {
      system.onCollisionEnter?.(this.components, collisionEvent);
    }
  }

  callCollisionStayEvents(collisionEvent: CollisionEvent) {
    for (const system of this.systems) {
      system.onCollisionStay?.(this.components, collisionEvent);
    }
  }

  callCollisionExitEvents(collisionEvent: CollisionEvent) {
    for (const system of this.systems) {
      system.onCollisionExit?.(this.components, collisionEvent);
    }
  }

  callTriggerEnterEvents(triggerEvent: TriggerEvent) {
    for (const system of this.systems) {
      system.onTriggerEnter?.(this.components, triggerEvent);
    }

  }

  callTriggerExitEvents(triggerEvent: TriggerEvent) {

    for (const system of this.systems) {
      system.onTriggerExit?.(this.components, triggerEvent);
    }
  }

  callTriggerStayEvents(triggerEvent: TriggerEvent) {
    for (const system of this.systems) {
      system.onTriggerStay?.(this.components, triggerEvent);
    }

  }
}