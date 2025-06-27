import type { GameEntity } from "../../types/EngineEntity";

export interface Component {
  gameEntity: GameEntity;
  enabled: boolean;
  readonly type: string;
  readonly category: string;
  readonly instanceId: number;
}

type BaseOmittedKeys = "gameEntity" | "instanceId" | "type" | "category";

export type ComponentOptions<T extends Component> = Partial<Omit<T, BaseOmittedKeys>>;