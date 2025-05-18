import {
  CHUNK_DISPOSE_DISTANCE_IN_PIXELS,
  CHUNK_LOADING_DISTANCE,
  CHUNK_SIZE,
  CHUNK_SIZE_IN_PIXELS,
  NOISE_SCALE,
  TILE_SIZE,
  WATER_THRESHOLD,
} from "./constants";
import { spawnChunkEntities } from "./entities";
import { gameState } from "./game-state";
import { ceil, distance, floor } from "./math";
import { prng, rand, scaledNoise } from "./random";
import { type ChunkKey, Tile } from "./types/";

export function createChunkKey(x: number, y: number): ChunkKey {
  return `${x},${y}`;
}

export function createChunk(x: number, y: number) {
  const key = createChunkKey(x, y);
  const originX = x * CHUNK_SIZE;
  const originY = y * CHUNK_SIZE;

  const chunk: Tile[][] = [];

  for (let dx = 0; dx < CHUNK_SIZE; dx++) {
    const row: Tile[] = [];
    for (let dy = 0; dy < CHUNK_SIZE; dy++) {
      const tileX = originX + dx;
      const tileY = originY + dy;

      const value = scaledNoise(tileX / NOISE_SCALE, tileY / NOISE_SCALE);
      const tile =
        value < WATER_THRESHOLD ? getSmoothWaterTile(tileX, tileY) : Tile.GRASS;

      row.push(tile);
    }
    chunk.push(row);
  }

  gameState.chunks[key] = chunk;
}

export function getSmoothWaterTile(x: number, y: number): Tile {
  const get = (dx: number, dy: number) =>
    scaledNoise((x + dx) / NOISE_SCALE, (y + dy) / NOISE_SCALE) <
    WATER_THRESHOLD;

  const n = {
    top: get(0, -1),
    right: get(1, 0),
    bottom: get(0, 1),
    left: get(-1, 0),
    topLeft: get(-1, -1),
    topRight: get(1, -1),
    bottomLeft: get(-1, 1),
    bottomRight: get(1, 1),
  };

  const rules: Array<[Tile, boolean]> = [
    // INNER CORNERS
    [Tile.WATER_INNER_TOP_LEFT, !n.top && !n.left],
    [Tile.WATER_INNER_TOP_RIGHT, !n.top && !n.right],
    [Tile.WATER_INNER_BOTTOM_LEFT, !n.bottom && !n.left],
    [Tile.WATER_INNER_BOTTOM_RIGHT, !n.bottom && !n.right],

    // SIDES
    [Tile.WATER_TOP_MIDDLE, !n.top && n.left && n.right],
    [Tile.WATER_RIGHT_MIDDLE, !n.right && n.top && n.bottom],
    [Tile.WATER_BOTTOM_MIDDLE, !n.bottom && n.left && n.right],
    [Tile.WATER_LEFT_MIDDLE, !n.left && n.top && n.bottom],

    // OUTER CORNERS
    [Tile.WATER_OUTER_TOP_LEFT, n.bottom && n.right && !n.bottomRight],
    [Tile.WATER_OUTER_TOP_RIGHT, n.bottom && n.left && !n.bottomLeft],
    [Tile.WATER_OUTER_BOTTOM_LEFT, n.top && n.right && !n.topRight],
    [Tile.WATER_OUTER_BOTTOM_RIGHT, n.top && n.left && !n.topLeft],
  ];

  for (const [tile, condition] of rules) {
    if (condition) return tile;
  }

  const r = prng();
  if (r < 0.05) return Tile.WATER_FISH_SHADOW_1;
  if (r < 0.1) return Tile.WATER_FISH_SHADOW_2;
  if (r < 0.15) return Tile.WATER_FISH_SHADOW_3;

  return Tile.WATER_MIDDLE;
}

export function getChunkTopLeftCorner(key: ChunkKey) {
  const [x, y] = key.split(",").map(Number);
  return [x * CHUNK_SIZE_IN_PIXELS, y * CHUNK_SIZE_IN_PIXELS];
}

export function getChunkPositionFromKey(chunkKey: ChunkKey) {
  return chunkKey.split(",").map(Number);
}

export function getChunkPositionFromWorldPosition(
  worldX: number,
  worldY: number,
) {
  const chunkX = floor(worldX / CHUNK_SIZE_IN_PIXELS);
  const chunkY = floor(worldY / CHUNK_SIZE_IN_PIXELS);
  return [chunkX, chunkY];
}

export function getChunkFromWorldPosition(worldX: number, worldY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(worldX, worldY);
  return gameState.chunks[createChunkKey(chunkX, chunkY)];
}

export function getChunkKeyFromWorldPosition(worldX: number, worldY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(worldX, worldY);
  return createChunkKey(chunkX, chunkY);
}

export function getRandomChunkKey() {
  const keys = [...Object.keys(gameState.chunks)];
  const index = rand(0, keys.length);
  return keys[index];
}

export function generateChunksAround(screenX: number, screenY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(screenX, screenY);

  const neighbors: ChunkKey[] = [];
  const n = CHUNK_LOADING_DISTANCE;

  for (let dx = floor(-n / 2); dx < ceil(n / 2); dx++) {
    for (let dy = floor(-n / 2); dy < ceil(n / 2); dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push(createChunkKey(chunkX + dx, chunkY + dy));
    }
  }

  for (const neighborKey of neighbors) {
    if (!(neighborKey in gameState.chunks)) {
      const [newChunkX, newChunkY] = getChunkPositionFromKey(neighborKey);
      createChunk(newChunkX, newChunkY);
      spawnChunkEntities(neighborKey);
    }
  }
}

export function disposeOfDistantChunks() {
  for (const chunkKey of Object.keys(gameState.chunks)) {
    const [chunkX, chunkY] = getChunkTopLeftCorner(chunkKey as ChunkKey);
    const chunkDistance = distance(
      chunkX,
      chunkY,
      gameState.player.position.x,
      gameState.player.position.y,
    );

    if (chunkDistance > CHUNK_DISPOSE_DISTANCE_IN_PIXELS) {
      delete gameState.chunks[chunkKey as ChunkKey];
    }
  }
}

export function getChunkTileIndexFromWorldPosition(
  worldX: number,
  worldY: number,
) {
  const chunkKey = getChunkKeyFromWorldPosition(worldX, worldY);
  const [chunkTopLeftX, chunkTopLeftY] = getChunkTopLeftCorner(chunkKey);

  const tileX = floor((worldX - chunkTopLeftX) / TILE_SIZE);
  const tileY = floor((worldY - chunkTopLeftY) / TILE_SIZE);

  return [tileX, tileY];
}
