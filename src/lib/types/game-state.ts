import type { Camera } from "./camera";
import type { Chunk, ChunkKey } from "./chunk";
import type { GameEntity, InventoryItem } from "./entity";
import type { Player } from "./player";

export interface GameState {
  chunks: Record<ChunkKey, Chunk>;
  camera: Camera;
  player: Player;
  entities: GameEntity[];
  hoveredEntityId: string;
  inventory: InventoryItem[];
  selectedItemIndex: number;
  dayNightCycle: {
    daylight: boolean;
    lastCycle: number;
  };
  gameTime: number;
  debug: boolean;
  profile: boolean;
  loadedFromStorage: boolean;
}
