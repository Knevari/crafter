import type { BaseEntity } from "../../lib/types";
import type { Component } from "../types/component";

export function mapToObjectWithEntityId(
  map: Map<string, Map<BaseEntity, Component>>
): any {
  const obj: any = {};

  for (const [componentName, entitiesMap] of map) {
    obj[componentName] = {};
    for (const [entity, component] of entitiesMap) {
      const entityId = (entity as any).id ?? entity.toString();
      obj[componentName][entityId] = component;
    }
  }

  return obj;
}