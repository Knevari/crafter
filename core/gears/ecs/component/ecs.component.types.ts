import type { Component } from "../../component/component";
import type { GameEntity } from "../../../types/EngineEntity";
import { createState } from "./ecs.component.functions";

export interface ECSComponentState {
    readonly persistent: Map<string, Map<GameEntity, Component>>;
    readonly transient: Map<string, Map<GameEntity, Component>>;
    readonly category: Map<string, Set<Component>>;

}

export const COMPONENT_STATE = createState();
