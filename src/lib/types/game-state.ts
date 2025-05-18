import type { Camera } from "./camera";
import type { Chunk, ChunkKey } from "./chunk";
import type { Entity, InventoryItem } from "./entity";
import type { Player } from "./player";

export interface GameState {
  chunks: Record<ChunkKey, Chunk>;
  camera: Camera;
  player: Player;
  entities: Entity[];
  hoveredEntityId: string;
  inventory: InventoryItem[];
  dayNightCycle: {
    daylight: boolean;
    lastCycle: number;
  };
  gameTime: number;
  debug: boolean;
  profile: boolean;
}
