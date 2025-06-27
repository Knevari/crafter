import type { Component } from "../../component/component";
import type { ECSComponentState } from "./ecs.component.types";

export function addToCategory(state: ECSComponentState, component: Component): void {
  if (!component.category) return;
  if (!state.category.has(component.category)) {
    state.category.set(component.category, new Set());
  }
  state.category.get(component.category)!.add(component);
}

export function removeFromCategory(state: ECSComponentState, component: Component): void {
  if (!component.category) return;
  const set = state.category.get(component.category);
  if (set) {
    set.delete(component);
    if (set.size === 0) {
      state.category.delete(component.category);
    }
  }
}
