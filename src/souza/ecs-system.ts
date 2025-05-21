import type { ECSComponents } from "./ecs-components";
import type { System } from "./systems/system";

export class ECSSystems {
  private systems: System[] = [];
  private components: ECSComponents;

  constructor(components: ECSComponents) {
    this.components = components;
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  update(deltaTime: number): void {
    for (const system of this.systems) {
      system.update?.(this.components, deltaTime);
    }
  }
}