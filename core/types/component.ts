import type { ComponentType } from "./component-type";
import type { GameEntity } from "./EngineEntity";

export interface Component {
  gameEntity: GameEntity;
  enabled: boolean;
  readonly type: ComponentType;
  readonly category: string;
  readonly instanceId: number;
}
