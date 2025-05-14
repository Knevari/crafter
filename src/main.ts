const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// constants
const TILE_SIZE = 16;
const PLAYER_SIZE = TILE_SIZE * 0.8;
const CHUNK_SIZE = 8;
const CHUNK_SIZE_IN_PIXELS = TILE_SIZE * CHUNK_SIZE;

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

function getChunkPositionFromScreenPosition(screenX: number, screenY: number) {
  const chunkX = floor(screenX / CHUNK_SIZE_IN_PIXELS);
  const chunkY = floor(screenY / CHUNK_SIZE_IN_PIXELS);
  return [chunkX, chunkY];
}

function getChunkKeyFromScreenPosition(screenX: number, screenY: number) {
  const [chunkX, chunkY] = getChunkPositionFromScreenPosition(screenX, screenY);
  return createChunkKey(chunkX, chunkY);
}

function highlightChunks() {
  ctx.font = "16px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
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
  const [chunkX, chunkY] = getChunkPositionFromScreenPosition(screenX, screenY);

  const neighbors = [
    // Top
    createChunkKey(chunkX, chunkY - 1),
    // Bottom
    createChunkKey(chunkX, chunkY + 1),
    // Left
    createChunkKey(chunkX - 1, chunkY),
    // Right
    createChunkKey(chunkX + 1, chunkY),
    // Top Left
    createChunkKey(chunkX - 1, chunkY - 1),
    // Top Right
    createChunkKey(chunkX + 1, chunkY - 1),
    // Bottom Left
    createChunkKey(chunkX - 1, chunkY + 1),
    // Bottom Right
    createChunkKey(chunkX + 1, chunkY + 1),
  ];

  for (const neighborKey of neighbors) {
    if (!chunks.has(neighborKey)) {
      const [newChunkX, newChunkY] = getChunkPositionFromKey(neighborKey);
      createChunk(newChunkX, newChunkY);
    }
  }
}

// player
const player = {
  x: 0,
  y: 0,
  speed: 1,
};

function spawnPlayer() {
  const chunkKey = getRandomChunkKey();
  const [chunkTopLeftX, chunkTopLeftY] = getChunkTopLeftCorner(chunkKey);
  const chunk = chunks.get(chunkKey);

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
  // width in tiles
  width: canvas.width,
  // height in tiles
  height: canvas.height,
  target: player,
};

function moveCamera(deltaTime: number) {
  camera.x = camera.target.x - camera.width / 2;
  camera.y = camera.target.y - camera.height / 2;
}

// functions
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function floor(value: number) {
  return Math.floor(value);
}

function clearBackground() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function main() {
  createChunk(0, 0);

  spawnPlayer();
  update();
}

let lastUpdatedAt = Date.now();
let deltaTime = 0;

function update() {
  deltaTime = Date.now() - lastUpdatedAt;
  lastUpdatedAt = Date.now();

  clearBackground();

  generateChunksAround(player.x, player.y);

  movePlayer(deltaTime);
  moveCamera(deltaTime);

  drawChunks();
  drawPlayer();

  if (debugModeEnabled) {
    highlightChunks();
  }

  requestAnimationFrame(update);
}

main();
