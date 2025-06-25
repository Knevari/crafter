import type { Component } from "../../../types/component";
import type { GameEntity } from "../../../types/EngineEntity";

export interface ECSComponentState {
    readonly persistent: Map<string, Map<GameEntity, Component>>;
    readonly transient: Map<string, Map<GameEntity, Component>>;
    readonly persistentSingletons: Map<string, Component>;
    readonly transientSingletons: Map<string, Component>;
    readonly category: Map<string, Set<Component>>;

}

export function createState(): ECSComponentState {
  return {
    persistent: new Map(),
    transient: new Map(),
    persistentSingletons: new Map(),
    transientSingletons: new Map(),
    category: new Map(),
  };
}