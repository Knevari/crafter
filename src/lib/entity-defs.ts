import { rand } from "./random";
import {
  EntityType,
  type Animator,
  type DropItem,
  type Health,
  type CollisionBox,
  type Sprite,
} from "./types";

type EntityDefinition = {
  sprite?: Sprite;
  animator?: Animator;
  collisionBox: CollisionBox;
  behaviors: string[];
  health: Health;
  drops: DropItem[] | (() => DropItem[]);
};

export const ENTITY_DEFINITIONS: Record<number, EntityDefinition> = {
  [EntityType.TREE]: {
    sprite: { sourceX: 0, sourceY: 0, sourceW: 4, sourceH: 5 },
    collisionBox: { xPercentage: 0.2, yPercentage: 0.2, yOffset: 0.2 },
    behaviors: [],
    health: { current: 1, max: 1 },
    drops: () => [{ type: EntityType.ITEM_TREE, quantity: rand(1, 5) }],
  },
  [EntityType.ITEM_TREE]: {
    sprite: { sourceX: 10, sourceY: 8, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    drops: [],
  },
  [EntityType.ROCK]: {
    sprite: { sourceX: 9, sourceY: 7, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    drops: () => [{ type: EntityType.ITEM_ROCK, quantity: rand(1, 5) }],
  },
  [EntityType.ITEM_ROCK]: {
    sprite: { sourceX: 0, sourceY: 4, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    drops: () => [{ type: EntityType.ITEM_ROCK, quantity: rand(1, 5) }],
  },
  [EntityType.PIG]: {
    sprite: { sourceX: 0, sourceY: 0, sourceW: 1, sourceH: 1 },
    animator: {
      animations: {
        idle: { row: 0, frames: 2, frameDuration: 0.15 },
        walk: { row: 1, frames: 2, frameDuration: 0.15 },
      },
      current: "idle",
      elapsed: 0,
      frame: 0,
      startTime: 0,
    },
    collisionBox: { xPercentage: 0.6, yPercentage: 0.4 },
    behaviors: ["wander"],
    health: { current: 3, max: 3 },
    drops: [],
  },
};
