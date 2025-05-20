import type { Animator } from "./animation";

export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Direction = "up" | "right" | "down" | "left";

export enum EntityType {
  PLAYER,
  TREE,
  ROCK,
  ITEM_TREE,
  ITEM_ROCK,
  PIG,
  SLIME,
  SLIME_GREEN,
  SKELETON,
  AXE,
  ITEM_AXE,
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

export type CollisionBox = {
  xPercentage: number;
  yPercentage: number;
  yOffset?: number;
};

export type InventoryItem = {
  amount: number;
  entity: Entity;
};

export interface Entity {
  id: string;
  type: EntityType;
  sprite: Sprite | null;
  position: Position;
  collisionBox: CollisionBox;
  animator: Animator | null;
  direction?: Direction;
  health: Health;
  drops: DropItem[];
  dimensions: Dimensions;
  behaviors?: string[];
  inInventory?: boolean;
  data: Record<string, any>;
}
