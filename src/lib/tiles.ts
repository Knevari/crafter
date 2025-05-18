import { Tile, type Sprite } from "./types";

export const tileSprites: Record<Tile, Sprite> = {
  [Tile.GRASS]: {
    sourceX: 0,
    sourceY: 0,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_MIDDLE]: {
    sourceX: 1,
    sourceY: 1,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_INNER_TOP_LEFT]: {
    sourceX: 0,
    sourceY: 0,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_INNER_TOP_RIGHT]: {
    sourceX: 2,
    sourceY: 0,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_INNER_BOTTOM_LEFT]: {
    sourceX: 0,
    sourceY: 2,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_INNER_BOTTOM_RIGHT]: {
    sourceX: 2,
    sourceY: 2,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_TOP_MIDDLE]: {
    sourceX: 1,
    sourceY: 0,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_RIGHT_MIDDLE]: {
    sourceX: 2,
    sourceY: 1,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_BOTTOM_MIDDLE]: {
    sourceX: 1,
    sourceY: 2,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_LEFT_MIDDLE]: {
    sourceX: 0,
    sourceY: 1,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_OUTER_TOP_LEFT]: {
    sourceX: 0,
    sourceY: 3,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_OUTER_TOP_RIGHT]: {
    sourceX: 1,
    sourceY: 3,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_OUTER_BOTTOM_LEFT]: {
    sourceX: 0,
    sourceY: 4,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_OUTER_BOTTOM_RIGHT]: {
    sourceX: 1,
    sourceY: 4,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_FISH_SHADOW_1]: {
    sourceX: 0,
    sourceY: 5,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_FISH_SHADOW_2]: {
    sourceX: 1,
    sourceY: 5,
    sourceW: 1,
    sourceH: 1,
  },
  [Tile.WATER_FISH_SHADOW_3]: {
    sourceX: 2,
    sourceY: 5,
    sourceW: 1,
    sourceH: 1,
  },
};
