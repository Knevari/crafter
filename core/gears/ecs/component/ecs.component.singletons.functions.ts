import type { Component } from "../../../types/component";
import type { ECSComponentState } from "./ecs.component.types";

export function addSingleton<T extends Component>(
  state: ECSComponentState,
  type: string,
  component: T,
  persistent = true
): void {
  (persistent ? state.persistentSingletons : state.transientSingletons).set(type, component);
}

export function getSingleton<T extends Component>(state: ECSComponentState, type: string): T | undefined {
  return (
    state.persistentSingletons.get(type) ?? state.transientSingletons.get(type)
  ) as T | undefined;
}

export function removeSingleton(state: ECSComponentState, type: string): void {
  state.persistentSingletons.delete(type);
  state.transientSingletons.delete(type);
}

export function hasSingleton(state: ECSComponentState, type: string): boolean {
  return (
    state.persistentSingletons.has(type) || state.transientSingletons.has(type)
  );
}
