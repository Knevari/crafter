import type { Entity } from "../../lib/types";
import type { Component } from "../types/component";
import type { ComponentType } from "../types/component-type";

export class ECSComponents {
  private readonly persistentComponents: Map<string, Map<Entity, Component>>;
  private readonly transientComponents: Map<string, Map<Entity, Component>>;

  private readonly persistentSingletons: Map<string, Component>;
  private readonly transientSingletons: Map<string, Component>;

  constructor() {
    this.persistentComponents = new Map();
    this.transientComponents = new Map();
    this.persistentSingletons = new Map();
    this.transientSingletons = new Map();
  }
  getEntityByComponent(component: Component): Entity | undefined {
    return component.entityRef;
  }

  addComponent<T extends Component>(
    entity: Entity,
    component: T,
    persistent: boolean = true
  ): void {
    const target = persistent ? this.persistentComponents : this.transientComponents;

    if (!target.has(component.type)) {
      target.set(component.type, new Map());
    }

    component.entityRef = entity;
    target.get(component.type)!.set(entity, component);
  }

  getComponent<T extends Component>(
    entityId: Entity,
    componentType: ComponentType
  ): T | undefined {
    return (
      this.persistentComponents.get(componentType)?.get(entityId) ??
      this.transientComponents.get(componentType)?.get(entityId)
    ) as T | undefined;
  }

  hasComponent(entityId: Entity, componentType: ComponentType): boolean {
    return (
      this.persistentComponents.get(componentType)?.has(entityId) ??
      this.transientComponents.get(componentType)?.has(entityId) ??
      false
    );
  }

  removeComponent(entityId: Entity, componentType: ComponentType): void {
    this.persistentComponents.get(componentType)?.delete(entityId);
    this.transientComponents.get(componentType)?.delete(entityId);
  }

  removeEntity(entityId: Entity): void {
    for (const map of this.persistentComponents.values()) {
      map.delete(entityId);
    }
    for (const map of this.transientComponents.values()) {
      map.delete(entityId);
    }
  }

  getEntityByRef(ref: string): Entity | undefined {
  for (const componentMap of this.persistentComponents.values()) {
    for (const [entity, component] of componentMap.entries()) {
      if (component && component.entityRef?.id === ref) {
        return entity;
      }
    }
  }

  for (const componentMap of this.transientComponents.values()) {
    for (const [entity, component] of componentMap.entries()) {
      if (component && component.entityRef?.id === ref) {
        return entity;
      }
    }
  }

  return undefined;
}

  getEntitiesWithComponent(componentType: ComponentType): Entity[] {
    const persistent = [...(this.persistentComponents.get(componentType)?.keys() ?? [])];
    const transient = [...(this.transientComponents.get(componentType)?.keys() ?? [])];
    return [...persistent, ...transient];
  }

  getComponentsByType<T extends Component>(componentType: ComponentType): T[] {
    const persistent = [...(this.persistentComponents.get(componentType)?.values() ?? [])];
    const transient = [...(this.transientComponents.get(componentType)?.values() ?? [])];
    return [...persistent, ...transient] as T[];
  }


  addSingleton<T extends Component>(
    componentType: ComponentType,
    component: T,
    persistent: boolean = true
  ): void {
    component.entityRef = undefined;
    const target = persistent ? this.persistentSingletons : this.transientSingletons;
    target.set(componentType, component);
  }

  getSingletonComponent<T extends Component>(componentType: ComponentType): T | undefined {
    return (
      this.persistentSingletons.get(componentType) ??
      this.transientSingletons.get(componentType)
    ) as T | undefined;
  }

  removeSingleton(componentType: ComponentType): void {
    this.persistentSingletons.delete(componentType);
    this.transientSingletons.delete(componentType);
  }

  hasSingleton(componentType: ComponentType): boolean {
    return (
      this.persistentSingletons.has(componentType) ||
      this.transientSingletons.has(componentType)
    );
  }

  serializePersistentComponents(): Record<string, Record<string, Component>> {
    const result: Record<string, Record<string, Component>> = {};

    for (const [type, entities] of this.persistentComponents.entries()) {
      for (const [entityId, component] of entities.entries()) {
        if (!result[type]) result[type] = {};
        result[type][entityId.id] = component;
      }
    }

    return result;
  }

  serializePersistentSingletons(): Record<string, Component> {
    return Object.fromEntries(this.persistentSingletons.entries());
  }
}
