import type { Component } from "../../../types/component";
import type { GameEntity } from "../../../types/EngineEntity";
import { addToCategory, removeFromCategory } from "./ecs.component.category.functions";
import type { ECSComponentState } from "./ecs.component.types";

export function addComponent<T extends Component>(
  state: ECSComponentState,
  entity: GameEntity,
  component: T,
  persistent = true
): void {
  const target = persistent ? state.persistent : state.transient;
  if (!target.has(component.type)) {
    target.set(component.type, new Map());
  }
  component.gameEntity = entity;
  target.get(component.type)!.set(entity, component);
  addToCategory(state, component);
}

export function getComponent<T extends Component>(
  state: ECSComponentState,
  entity: GameEntity,
  type: string
): T | null {
  return (
    state.persistent.get(type)?.get(entity) ??
    state.transient.get(type)?.get(entity) ??
    null
  ) as T | null;
}

export function hasComponent(state: ECSComponentState, entity: GameEntity, type: string): boolean {
  return (
    state.persistent.get(type)?.has(entity) ??
    state.transient.get(type)?.has(entity) ??
    false
  );
}

export function removeComponent(state: ECSComponentState, entity: GameEntity, type: string): void {
  for (const source of [state.persistent, state.transient]) {
    const component = source.get(type)?.get(entity);
    if (component) {
      removeFromCategory(state, component);
      source.get(type)!.delete(entity);
    }
  }
}

export function getComponentsByType<T extends Component>(state: ECSComponentState, type: string): T[] {
  return [
    ...(state.persistent.get(type)?.values() ?? []),
    ...(state.transient.get(type)?.values() ?? []),
  ] as T[];
}

export function getComponentsByCategory<T extends Component>(state: ECSComponentState, category: string): T[] {
  return Array.from(state.category.get(category) ?? []) as T[];
}
