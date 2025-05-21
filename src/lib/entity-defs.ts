import { rand } from "./random";
import {
  EntityType,
  type Animator,
  type DropItem,
  type Health,
  type CollisionBox,
  type Sprite,
} from "./types";

type WeaponEntityData = {
  baseDamage: number;
  extraDamagePercent: number;
  extraDamageTo: EntityType[];
};

type EntityDataMap = {
  [EntityType.TREE]: {};
  [EntityType.ITEM_TREE]: {};
  [EntityType.ROCK]: {};
  [EntityType.ITEM_ROCK]: {};
  [EntityType.PIG]: {};
  [EntityType.SLIME]: {};
  [EntityType.SLIME_GREEN]: {};
  [EntityType.SKELETON]: {};
  [EntityType.PLAYER]: {};
  [EntityType.CRAFTING_TABLE]: {};
  [EntityType.AXE]: WeaponEntityData;
};

type EntityDataDefaults = { item?: boolean; inventory?: boolean };

type EntityDefinition<T extends EntityType> = {
  sprite?: Sprite;
  animator?: Animator;
  collisionBox: CollisionBox;
  behaviors: string[];
  health: Health;
  drops: DropItem[] | (() => DropItem[]);
  tileSize?: number;
  data?: EntityDataDefaults & EntityDataMap[T];
};

function defineEntity<T extends EntityType>(type: T, def: EntityDefinition<T>) {
  return [type, def];
}

export const ENTITY_DEFINITIONS = Object.fromEntries([
  defineEntity(EntityType.TREE, {
    sprite: { sourceX: 0, sourceY: 0, sourceW: 4, sourceH: 5 },
    collisionBox: { xPercentage: 0.2, yPercentage: 0.2, yOffset: 0.2 },
    behaviors: [],
    health: { current: 5, max: 5 },
    drops: () => [{ type: EntityType.ITEM_TREE, quantity: rand(1, 5) }],
  }),
  defineEntity(EntityType.ITEM_TREE, {
    sprite: { sourceX: 10, sourceY: 8, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    data: { item: true },
    drops: [],
  }),
  defineEntity(EntityType.ROCK, {
    sprite: { sourceX: 0, sourceY: 3, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    drops: () => [{ type: EntityType.ITEM_ROCK, quantity: rand(1, 5) }],
    tileSize: 16,
  }),
  defineEntity(EntityType.ITEM_ROCK, {
    sprite: { sourceX: 0, sourceY: 4, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    data: { item: true },
    drops: [],
  }),
  defineEntity(EntityType.PIG, {
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
    behaviors: ["follow-player"],
    health: { current: 3, max: 3 },
    drops: [],
    tileSize: 32,
  }),
  defineEntity(EntityType.SLIME, {
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
    tileSize: 32,
  }),
  defineEntity(EntityType.SLIME_GREEN, {
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
    tileSize: 64,
  }),
  defineEntity(EntityType.SKELETON, {
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
    tileSize: 32,
  }),
  defineEntity(EntityType.AXE, {
    sprite: { sourceX: 7, sourceY: 10, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.6, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    data: {
      baseDamage: 2,
      extraDamagePercent: 0.5,
      extraDamageTo: [EntityType.TREE],
      item: true,
    },
    drops: [],
  }),
  defineEntity(EntityType.CRAFTING_TABLE, {
    sprite: { sourceX: 9, sourceY: 4, sourceW: 1, sourceH: 1 },
    collisionBox: { xPercentage: 0.8, yPercentage: 0.8 },
    behaviors: [],
    health: { current: 1, max: 1 },
    data: {},
    drops: [],
  }),
]) as Record<EntityType, EntityDefinition<EntityType>>;
