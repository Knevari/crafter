import type { ECSComponents } from "./ecs-components";
import type { System } from "../types/system";
import type { CollisionEvent } from "../types/collision-event";

export class ECSSystems {
  private systems: System[] = [];
  private components: ECSComponents;

  constructor(components: ECSComponents) {
    this.components = components;
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  callFixedUpdate(): void {
    for (const system of this.systems) {
      system.fixedUpdate?.(this.components);
    }
  }

  callUpdate(deltaTime: number): void {
    for (const system of this.systems) {
      system.update?.(this.components, deltaTime);
    }
  }

  callLatedUpdate(): void {
    for (const system of this.systems) {
      system.latedUpdate?.(this.components);
    }
  }

  callRender(): void {
    for (const system of this.systems) {
      system.render?.(this.components);
    }
  }
   callDrawGizmos(): void {
    for (const system of this.systems) {
      system.onDrawGizmos?.(this.components);
    }
  }

  callCollisionStayEvents(collisionEvent: CollisionEvent) {
    for (const system of this.systems) {
      system.onCollisionStay?.(collisionEvent);
    }
  }
}