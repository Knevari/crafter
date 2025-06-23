import type { ComponentType } from "./component-type";
import type { GameEntity } from "./EngineEntity";

export interface Component {
  gameEntity?: GameEntity;
  enabled: boolean;
  readonly type: ComponentType;
  readonly instanceId: number;
}