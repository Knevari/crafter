import type { Component } from "../../../types/component";
import type { GameEntity } from "../../../types/EngineEntity";

export interface ECSComponentState {
    readonly persistent: Map<string, Map<GameEntity, Component>>;
    readonly transient: Map<string, Map<GameEntity, Component>>;
    readonly category: Map<string, Set<Component>>;

}

export function createState(): ECSComponentState {
  return {
    persistent: new Map(),
    transient: new Map(),
    category: new Map(),
  };
}