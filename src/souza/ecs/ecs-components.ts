import type { BaseEntity } from "../../lib/types";
import type { Component } from "../types/component";
import type { ComponentType } from "../types/component-type";

export class ECSComponents {
  public readonly components: Map<string, Map<BaseEntity, Component>>;

  constructor() {
    this.components = new Map();
  }

  addComponent<T extends Component>(entityId: BaseEntity, componentType: ComponentType, component: T): void {
    if (!this.components.has(componentType)) {
      this.components.set(componentType, new Map());
    }
    component.entityId = entityId;
    this.components.get(componentType)!.set(entityId, component);
  }

  getComponent<T extends Component>(entityId: BaseEntity, componentType: ComponentType): T | undefined {
    return this.components.get(componentType)?.get(entityId) as T | undefined;
  }

  hasComponent(entityId: BaseEntity, componentType: ComponentType): boolean {
    return this.components.get(componentType)?.has(entityId) ?? false;
  }

  removeComponent(entityId: BaseEntity, componentType: ComponentType): void {
    this.components.get(componentType)?.delete(entityId);
  }

  removeEntity(entityId: BaseEntity): void {
    for (const map of this.components.values()) {
      map.delete(entityId);
    }
  }
queryEntitiesWithComponents(...types: ComponentType[]): BaseEntity[] {
  if (types.length === 0) return [];

  types.sort((a, b) =>
    this.getEntitiesWithComponent(a).length - this.getEntitiesWithComponent(b).length
  );

  const result = new Set(this.getEntitiesWithComponent(types[0]));

  for (let i = 1; i < types.length; i++) {
    const entities = this.getEntitiesWithComponent(types[i]);
    for (const e of result) {
      if (!entities.includes(e)) {
        result.delete(e);
      }
    }
  }

  return [...result];
}


  getEntityByComponent(component: Component): BaseEntity | undefined {

    return component.entityId;
  }
  getEntitiesWithComponent(componentType: ComponentType): BaseEntity[] {
    return [...(this.components.get(componentType)?.keys() ?? [])];
  }

  getComponentsByType<T extends Component>(componentType: ComponentType): T[] {
    const map = this.components.get(componentType);
    return map ? [...map.values()] as T[] : [];
  }
}
