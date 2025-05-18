export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Direction = "up" | "right" | "down" | "left";

export interface Animation {
  row: number;
  frames: number;
  frameDuration: number;
  totalDuration?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

export type AnimationSet = Record<string, Animation>;

export interface Animator {
  animations: AnimationSet;
  current: string;
  frame: number;
  elapsed: number;
  startTime: number;
}

export interface Camera {
  position: Position;
  dimensions: Dimensions;
  target: Player;
}

export type ChunkKey = `${string},${string}`;

export type Chunk = Tile[][];

export enum EntityType {
  PLAYER,
  TREE,
  ROCK,
  ITEM_TREE,
  ITEM_ROCK,
  PIG,
}

export type DropItem = {
  type: EntityType;
  quantity: number;
  chance?: number;
};

export type Sprite = {
  sourceX: number;
  sourceY: number;
  sourceW: number;
  sourceH: number;
};

export type Health = {
  current: number;
  max: number;
};

export type HitBox = {
  xPercentage: number;
  yPercentage: number;
  yOffset?: number;
};

export interface Entity {
  id: string;
  type: EntityType;
  sprite: Sprite | null;
  position: Position;
  hitbox: HitBox;
  animator: Animator | null;
  direction?: Direction;
  health: Health;
  drops: DropItem[];
  dimensions: Dimensions;
  inInventory?: boolean;
}

export type InventoryItem = {
  amount: number;
  entity: Entity;
};

export enum Tile {
  GRASS,
  WATER_MIDDLE,
  WATER_INNER_TOP_LEFT,
  WATER_INNER_TOP_RIGHT,
  WATER_INNER_BOTTOM_LEFT,
  WATER_INNER_BOTTOM_RIGHT,
  WATER_TOP_MIDDLE,
  WATER_RIGHT_MIDDLE,
  WATER_BOTTOM_MIDDLE,
  WATER_LEFT_MIDDLE,
  WATER_OUTER_TOP_LEFT,
  WATER_OUTER_TOP_RIGHT,
  WATER_OUTER_BOTTOM_LEFT,
  WATER_OUTER_BOTTOM_RIGHT,
  WATER_FISH_SHADOW_1,
  WATER_FISH_SHADOW_2,
  WATER_FISH_SHADOW_3,
}

export interface Player extends Entity {
  speed: number;
  moving: boolean;
  attacking: boolean;
  direction: Direction;
}

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
