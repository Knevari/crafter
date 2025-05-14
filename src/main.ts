import Alea from "alea";
import { createNoise2D } from "simplex-noise";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// constants
const TILE_SIZE = 16;
const PLAYER_SIZE = TILE_SIZE * 0.8;
const CHUNK_SIZE = 8;
const CHUNK_SIZE_IN_PIXELS = TILE_SIZE * CHUNK_SIZE;
const SEED = 123;

let debugModeEnabled = false;

// keymap
const pressedKeys = new Set();

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "z") debugModeEnabled = !debugModeEnabled;
  pressedKeys.add(event.key);
});

document.addEventListener("keyup", (event: KeyboardEvent) => {
  pressedKeys.delete(event.key);
});

// math
function floor(value: number) {
  return Math.floor(value);
}

function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
) {
  const result =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

  if (start2 < stop2) {
    return constrain(result, start2, stop2);
  } else {
    return constrain(result, stop2, start2);
  }
}

function constrain(value: number, low: number, high: number) {
  return Math.max(Math.min(value, high), low);
}

// random
const prng = Alea(SEED);
const noise = createNoise2D(prng);

function rand(min: number, max: number) {
  return Math.floor(prng() * (max - min) + min);
}

// entities
enum EntityType {
  TREE,
}

type Entity = {
  type: EntityType;
  x: number;
  y: number;
};

const entities: Entity[] = [];

function createEntity(type: EntityType, worldX: number, worldY: number) {
  entities.push({ type, x: worldX, y: worldY });
}

function spawnChunkEntities(chunkKey: ChunkKey) {
  const [chunkX, chunkY] = getChunkPositionFromKey(chunkKey);

  for (let dx = 0; dx < CHUNK_SIZE; dx++) {
    for (let dy = 0; dy < CHUNK_SIZE; dy++) {
      const entityWorldX = chunkX * CHUNK_SIZE_IN_PIXELS + dx * TILE_SIZE;
      const entityWorldY = chunkY * CHUNK_SIZE_IN_PIXELS + dy * TILE_SIZE;

      const spawnProbability = map(
        noise(entityWorldX / 300, entityWorldY / 300),
        -1,
        1,
        0,
        1,
      );

      if (spawnProbability < 0.2) {
        createEntity(EntityType.TREE, entityWorldX, entityWorldY);
      }
    }
  }
}

function drawEntities() {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    switch (entity.type) {
      case EntityType.TREE: {
        ctx.fillStyle = "#002C04";
        ctx.fillRect(
          entity.x - camera.x,
          entity.y - camera.y,
          TILE_SIZE,
          TILE_SIZE,
        );
      }
    }
  }
}

// tiles
enum Tile {
  GRASS,
  WATER,
}

// chunks
type ChunkKey = `${string},${string}`;
type Chunk = Tile[][];
const chunks = new Map<ChunkKey, Chunk>();

function createChunkKey(x: number, y: number): ChunkKey {
  return `${x},${y}`;
}

function createChunk(x: number, y: number) {
  const key = createChunkKey(x, y);
  const chunk = Array.from({ length: CHUNK_SIZE }, () =>
    Array.from({ length: CHUNK_SIZE }, () => Tile.GRASS),
  );

  chunks.set(key, chunk);
}

function getChunkTopLeftCorner(key: ChunkKey) {
  const [x, y] = key.split(",").map(Number);
  return [x * TILE_SIZE * CHUNK_SIZE, y * TILE_SIZE * CHUNK_SIZE];
}

function drawChunks() {
  for (const [key, chunk] of chunks.entries()) {
    const [cx, cy] = getChunkTopLeftCorner(key as ChunkKey);
    for (let i = 0; i < CHUNK_SIZE; i++) {
      for (let j = 0; j < CHUNK_SIZE; j++) {
        const x = cx + i * TILE_SIZE - camera.x;
        const y = cy + j * TILE_SIZE - camera.y;
        const tile = chunk[i][j];

        switch (tile) {
          case Tile.GRASS: {
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            break;
          }
          default: {
            ctx.fillStyle = "red";
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }
  }
}

function getChunkPositionFromKey(chunkKey: ChunkKey) {
  return chunkKey.split(",").map(Number);
}

function getChunkPositionFromWorldPosition(screenX: number, screenY: number) {
  const chunkX = floor(screenX / CHUNK_SIZE_IN_PIXELS);
  const chunkY = floor(screenY / CHUNK_SIZE_IN_PIXELS);
  return [chunkX, chunkY];
}

function getChunkKeyFromWorldPosition(screenX: number, screenY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(screenX, screenY);
  return createChunkKey(chunkX, chunkY);
}

function highlightChunks() {
  ctx.font = "16px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  for (const key of chunks.keys()) {
    const [x, y] = getChunkTopLeftCorner(key);
    ctx.strokeRect(
      x - camera.x,
      y - camera.y,
      CHUNK_SIZE * TILE_SIZE,
      CHUNK_SIZE * TILE_SIZE,
    );
    ctx.fillText(
      key,
      x + CHUNK_SIZE_IN_PIXELS / 2 - camera.x,
      y + CHUNK_SIZE_IN_PIXELS / 2 - camera.y,
    );
  }
}

function getRandomChunkKey() {
  const keys = [...chunks.keys()];
  const index = rand(0, keys.length);
  return keys[index];
}

function generateChunksAround(screenX: number, screenY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(screenX, screenY);

  const neighbors: ChunkKey[] = [];
  const n = 5;

  for (let dx = floor(-n / 2); dx < n / 2; dx++) {
    for (let dy = floor(-n / 2); dy < n / 2; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push(createChunkKey(chunkX + dx, chunkY + dy));
    }
  }

  for (const neighborKey of neighbors) {
    if (!chunks.has(neighborKey)) {
      const [newChunkX, newChunkY] = getChunkPositionFromKey(neighborKey);
      createChunk(newChunkX, newChunkY);
      spawnChunkEntities(neighborKey);
    }
  }
}

// cursor
const cursor = {
  x: 0,
  y: 0,
  hoveringEntity: false,
};

function drawCursor() {
  ctx.fillStyle = "#AC46CB";
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

canvas.addEventListener("mousemove", (event) => {
  const { top, left } = canvas.getBoundingClientRect();
  cursor.x += (event.clientX - left - cursor.x) * 0.1;
  cursor.y += (event.clientY - top - cursor.y) * 0.1;
});

// player
const player = {
  x: 0,
  y: 0,
  speed: 400,
};

function spawnPlayer() {
  const chunkKey = getRandomChunkKey();
  const chunk = chunks.get(chunkKey);
  const [chunkTopLeftX, chunkTopLeftY] = getChunkTopLeftCorner(chunkKey);

  if (!chunk) {
    throw new Error("Impossivel encontrar chunk aleatoria");
  }

  for (let i = 0; i < CHUNK_SIZE; i++) {
    for (let j = 0; j < CHUNK_SIZE; j++) {
      const tile = chunk[i][j];

      if (tile === Tile.GRASS) {
        player.x = chunkTopLeftX + i * TILE_SIZE;
        player.y = chunkTopLeftY + j * TILE_SIZE;
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "#1e2328";
  ctx.fillRect(
    player.x - camera.x,
    player.y - camera.y,
    PLAYER_SIZE,
    PLAYER_SIZE,
  );
}

function movePlayer(deltaTime: number) {
  let direction = { x: 0, y: 0 };

  if (pressedKeys.has("w")) direction.y -= 1;
  if (pressedKeys.has("s")) direction.y += 1;
  if (pressedKeys.has("a")) direction.x -= 1;
  if (pressedKeys.has("d")) direction.x += 1;

  player.x += player.speed * direction.x * deltaTime;
  player.y += player.speed * direction.y * deltaTime;
}

// camera
const camera = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  target: player,
};

function moveCamera(deltaTime: number) {
  camera.x += (camera.target.x - camera.width / 2 - camera.x) * 0.1;
  camera.y += (camera.target.y - camera.height / 2 - camera.y) * 0.1;
}

// main
function clearBackground() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function main() {
  createChunk(0, 0);

  spawnPlayer();
  requestAnimationFrame(update);
}

let lastUpdatedAt = performance.now();
let deltaTime = 0;

function update(now: number) {
  deltaTime = (now - lastUpdatedAt) / 1000;
  lastUpdatedAt = now;

  clearBackground();

  generateChunksAround(player.x, player.y);

  movePlayer(deltaTime);
  moveCamera(deltaTime);

  drawChunks();
  drawPlayer();
  drawEntities();
  drawCursor();

  if (debugModeEnabled) {
    highlightChunks();
  }

  requestAnimationFrame(update);
}

main();
