import type { BaseEntity } from "../lib/types";
import type { Component } from "./types/component";
import type { ComponentType } from "./types/component-type";

export class ECSComponents {
  private components: Map<string, Map<BaseEntity, Component>>;

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

    let result = new Set(this.getEntitiesWithComponent(types[0]));

    for (let i = 1; i < types.length; i++) {
      const entities = new Set(this.getEntitiesWithComponent(types[i]));
      result = new Set([...result].filter(e => entities.has(e)));
    }

    return [...result];
  }


  getEntitiesWithComponent(componentType: ComponentType): BaseEntity[] {
    return [...(this.components.get(componentType)?.keys() ?? [])];
  }

  getComponentsByType<T extends Component>(componentType: ComponentType): T[] {
    const map = this.components.get(componentType);
    return map ? [...map.values()] as T[] : [];
  }
}
