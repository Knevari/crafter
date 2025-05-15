import Alea from "alea";
import { createNoise2D } from "simplex-noise";

// images
export const tilesetImg = new Image();
tilesetImg.src = "/tilemap_packed.png";

function loadAssets() {
  const assets = [tilesetImg];

  return new Promise((resolve) => {
    let loaded = 0;

    assets.forEach((asset) => {
      asset.onload = () => {
        loaded++;
        if (loaded === assets.length) {
          resolve(assets);
        }
      };
    });
  });
}

// canvas
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// constants
const TILE_SIZE = 32;
const TILESET_TILE_SIZE = 16;
const PLAYER_SIZE = TILE_SIZE * 0.8;
const PLAYER_RANGE = 8;
const ITEM_PICKUP_RANGE = 2;
const CHUNK_SIZE = 8;
const CHUNK_SIZE_IN_PIXELS = TILE_SIZE * CHUNK_SIZE;
const SEED = 82347892134;

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

function ceil(value: number) {
  return Math.ceil(value);
}

function round(value: number) {
  return Math.round(value);
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
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

// helpers
function isColliding(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number,
): boolean {
  const left1 = x1 - w1 / 2;
  const right1 = x1 + w1 / 2;
  const top1 = y1 - h1 / 2;
  const bottom1 = y1 + h1 / 2;

  const left2 = x2 - w2 / 2;
  const right2 = x2 + w2 / 2;
  const top2 = y2 - h2 / 2;
  const bottom2 = y2 + h2 / 2;

  return !(
    right1 <= left2 ||
    left1 >= right2 ||
    bottom1 <= top2 ||
    top1 >= bottom2
  );
}

// random
const prng = Alea(SEED);
const noise = createNoise2D(prng);

function rand(min: number, max: number) {
  return Math.floor(prng() * (max - min) + min);
}

// animation
function float(entity: Entity, speed: number = 10, amplitude: number = 0.5) {
  const now = Date.now() / 1000;
  entity.y += Math.cos(now * speed) * amplitude;
}

// entities
enum EntityType {
  TREE,
  ROCK,
  ITEM_TREE,
  ITEM_ROCK,
}

type DropItem = {
  type: EntityType;
  quantity: number;
  chance?: number;
};

type EntitySprite = {
  sourceX: number;
  sourceY: number;
  sourceW: number;
  sourceH: number;
};

type Entity = {
  id: number;
  type: EntityType;
  sprite: EntitySprite | null;
  x: number;
  y: number;
  w: number;
  h: number;
  health: {
    current: number;
    max: number;
  };
  drops: DropItem[];
  inInventory: boolean;
};

let hoveredEntityId = -1;
let entityId = 1;
const entities: Entity[] = [];

function getEntityHealth(type: EntityType) {
  switch (type) {
    default: {
      return {
        current: 1,
        max: 1,
      };
    }
  }
}

function getEntityDrops(type: EntityType) {
  const drops: DropItem[] = [];
  switch (type) {
    case EntityType.TREE: {
      drops.push({
        type: EntityType.ITEM_TREE,
        quantity: rand(1, 5),
      });
      break;
    }
    case EntityType.ROCK: {
      drops.push({
        type: EntityType.ITEM_ROCK,
        quantity: rand(1, 5),
      });
    }
  }
  return drops;
}

function getEntitySprite(type: EntityType) {
  switch (type) {
    case EntityType.TREE: {
      return {
        sourceX: 4,
        sourceY: 0,
        sourceW: 1,
        sourceH: 2,
      };
    }
    case EntityType.ITEM_TREE: {
      return {
        sourceX: 10,
        sourceY: 8,
        sourceW: 1,
        sourceH: 1,
      };
    }
    case EntityType.ROCK:
      return {
        sourceX: 9,
        sourceY: 7,
        sourceW: 1,
        sourceH: 1,
      };
    case EntityType.ITEM_ROCK:
      return {
        sourceX: 9,
        sourceY: 7,
        sourceW: 1,
        sourceH: 1,
      };
    default: {
      return null;
    }
  }
}

function getEntityTypeAsString(type: EntityType) {
  switch (type) {
    case EntityType.TREE: {
      return "TREE";
    }
    case EntityType.ITEM_TREE: {
      return "ITEM_TREE";
    }
    case EntityType.ROCK: {
      return "ROCK";
    }
    case EntityType.ITEM_ROCK: {
      return "ITEM_ROCK";
    }
    default: {
      return "UNKNOWN";
    }
  }
}

function createEntity(
  type: EntityType,
  worldX: number,
  worldY: number,
  width: number,
  height: number,
) {
  const drops = getEntityDrops(type);
  const health = getEntityHealth(type);
  const sprite = getEntitySprite(type);
  entities.push({
    id: entityId++,
    type,
    sprite,
    x: worldX,
    y: worldY,
    w: width,
    h: height,
    health,
    drops,
    inInventory: false,
  });
}

function destroyEntity(entityId: number) {
  const entity = entities.find((entity) => entity.id === entityId);
  if (!entity) return;

  // Drop its items
  for (const drop of entity.drops) {
    const dropProbability = drop.chance ?? 1;
    if (prng() < dropProbability) {
      createEntity(
        drop.type,
        entity.x,
        entity.y + entity.h * TILE_SIZE - TILE_SIZE,
        1,
        1,
      );
    }
  }

  // Delete from entities
  const entityIndex = entities.findIndex((entity) => entity.id === entityId);
  if (entityIndex !== -1) entities.splice(entityIndex, 1);
}

function canPlaceEntity(
  worldX: number,
  worldY: number,
  width: number,
  height: number,
) {
  const newEntityCenterX = worldX + (width * TILE_SIZE) / 2;
  const newEntityCenterY = worldY + (width * TILE_SIZE) / 2;

  for (const entity of entities) {
    const entityCenterX = entity.x + (entity.w * TILE_SIZE) / 2;
    const entityCenterY = entity.y + (entity.h * TILE_SIZE) / 2;

    if (
      isColliding(
        newEntityCenterX,
        newEntityCenterY,
        width * TILE_SIZE,
        height * TILE_SIZE,
        entityCenterX,
        entityCenterY,
        entity.w * TILE_SIZE,
        entity.h * TILE_SIZE,
      )
    ) {
      return false;
    }
  }

  return true;
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

      if (spawnProbability < 0.02) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 1, 1)) {
          createEntity(EntityType.ROCK, entityWorldX, entityWorldY, 1, 1);
        }
      }
      if (spawnProbability < 0.2) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 1, 2)) {
          createEntity(EntityType.TREE, entityWorldX, entityWorldY, 1, 2);
        }
      }
    }
  }
}

function drawEntities() {
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.sprite && !entity.inInventory) {
      drawSprite(entity);
    }
  }
}

function drawSprite(entity: Entity) {
  if (entity.sprite) {
    ctx.drawImage(
      tilesetImg,
      entity.sprite.sourceX * TILESET_TILE_SIZE,
      entity.sprite.sourceY * TILESET_TILE_SIZE,
      entity.sprite.sourceW * TILESET_TILE_SIZE,
      entity.sprite.sourceH * TILESET_TILE_SIZE,
      entity.x - camera.x,
      entity.y - camera.y,
      entity.w * TILE_SIZE,
      entity.h * TILE_SIZE,
    );
  }
}

function drawSpriteAt(
  entity: Entity,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  if (entity.sprite) {
    ctx.drawImage(
      tilesetImg,
      entity.sprite.sourceX * TILESET_TILE_SIZE,
      entity.sprite.sourceY * TILESET_TILE_SIZE,
      entity.sprite.sourceW * TILESET_TILE_SIZE,
      entity.sprite.sourceH * TILESET_TILE_SIZE,
      x,
      y,
      w,
      h,
    );
  }
}

function drawEntitiesCenterpoints() {
  for (const entity of entities) {
    const entityCenterX = entity.x + (entity.w * TILE_SIZE) / 2;
    const entityCenterY = entity.y + (entity.h * TILE_SIZE) / 2;

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(
      entityCenterX - camera.x,
      entityCenterY - camera.y,
      2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.closePath();
  }
}

function getEntityAtWorldPosition(worldX: number, worldY: number) {
  for (const entity of entities) {
    const { x: entityX, y: entityY, w: entityWidth, h: entityHeight } = entity;
    if (
      worldX >= entityX &&
      worldX <= entityX + entityWidth * TILE_SIZE &&
      worldY >= entityY &&
      worldY <= entityY + entityHeight * TILE_SIZE
    ) {
      return entity;
    }
  }
  return null;
}

function handleEntityClick(entity: Entity) {
  if (debugModeEnabled) {
    console.log(
      `Clicked ${getEntityTypeAsString(entity.type)} at`,
      entity.x,
      entity.y,
    );
  }
  switch (entity.type) {
    case EntityType.TREE: {
      // destroy tree, drop item
      entity.health.current -= 1;
      if (entity.health.current <= 0) {
        destroyEntity(entity.id);
      }
      break;
    }
    case EntityType.ROCK: {
      // destroy tree, drop item
      entity.health.current -= 1;
      if (entity.health.current <= 0) {
        destroyEntity(entity.id);
      }
      break;
    }
  }
}

function updateDroppedItems() {
  for (const entity of entities) {
    if (getEntityTypeAsString(entity.type).startsWith("ITEM_")) {
      float(entity);

      const distanceFromPlayer = distance(
        player.x,
        player.y,
        entity.x,
        entity.y,
      );

      if (distanceFromPlayer < ITEM_PICKUP_RANGE * TILE_SIZE) {
        if (debugModeEnabled) {
          console.log(
            `Picked up ${getEntityTypeAsString(entity.type)} from`,
            entity.x,
            entity.y,
          );
        }
        addToInventory(entity);
        destroyEntity(entity.id);
      }
    }
  }
}

// inventory
type InventoryItem = {
  amount: number;
  entity: Entity;
};

const inventory: InventoryItem[] = [];

function addToInventory(entity: Entity) {
  let itemInIventory = false;

  for (const item of inventory) {
    if (item.entity.type === entity.type) {
      itemInIventory = true;
      item.amount += 1;
    }
  }

  if (!itemInIventory) {
    entity.inInventory = true;
    inventory.push({
      amount: 1,
      entity,
    });
  }
}

function drawInventory() {
  const slotSize = 60;
  const totalItemsSlots = 4;

  const padding = 8;

  const inventoryWidth =
    totalItemsSlots * slotSize + padding * (totalItemsSlots - 1);
  const inventoryX = canvas.width / 2 - inventoryWidth / 2;
  const inventoryY = canvas.height - slotSize * 2;

  let currentX = inventoryX;

  for (let i = 0; i < totalItemsSlots; i++) {
    ctx.save();

    ctx.strokeStyle = "black";
    ctx.strokeRect(currentX + i * slotSize, inventoryY, slotSize, slotSize);
    ctx.font = "12px Arial";

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Draw item inside slot
    const item = inventory[i];

    if (item) {
      const itemX = currentX + i * slotSize + slotSize * 0.15;
      const itemY = inventoryY + slotSize * 0.15;
      const itemSize = slotSize * 0.7;
      drawSpriteAt(item.entity, itemX, itemY, itemSize, itemSize);
      ctx.fillText(`x${item.amount}`, itemX + itemSize, itemY + itemSize);
    }

    ctx.restore();

    currentX += padding;
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

function getChunkPositionFromWorldPosition(worldX: number, worldY: number) {
  const chunkX = floor(worldX / CHUNK_SIZE_IN_PIXELS);
  const chunkY = floor(worldY / CHUNK_SIZE_IN_PIXELS);
  return [chunkX, chunkY];
}

function getChunkFromWorldPosition(worldX: number, worldY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(worldX, worldY);
  return chunks.get(createChunkKey(chunkX, chunkY));
}

function getChunkKeyFromWorldPosition(worldX: number, worldY: number) {
  const [chunkX, chunkY] = getChunkPositionFromWorldPosition(worldX, worldY);
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
  const n = 3;

  for (let dx = floor(-n / 2); dx < ceil(n / 2); dx++) {
    for (let dy = floor(-n / 2); dy < ceil(n / 2); dy++) {
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

function getChunkTileIndexFromWorldPosition(worldX: number, worldY: number) {
  const chunkKey = getChunkKeyFromWorldPosition(worldX, worldY);
  const [chunkTopLeftX, chunkTopLeftY] = getChunkTopLeftCorner(chunkKey);

  const tileX = floor((worldX - chunkTopLeftX) / TILE_SIZE);
  const tileY = floor((worldY - chunkTopLeftY) / TILE_SIZE);

  return [tileX, tileY];
}

// cursor and interaction
const cursor = {
  x: 0,
  y: 0,
  size: 4,
};

function drawCursor() {
  ctx.fillStyle = "#AC46CB";
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, cursor.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

canvas.addEventListener("mousemove", (event) => {
  const { top, left } = canvas.getBoundingClientRect();
  cursor.x = event.clientX - left;
  cursor.y = event.clientY - top;

  let hoveringAnyEntity = false;

  // Verify if its hovering any entities
  entities.forEach((entity) => {
    const entityCenterX = entity.x + (entity.w * TILE_SIZE) / 2;
    const entityCenterY = entity.y + (entity.h * TILE_SIZE) / 2;

    const hovering = isColliding(
      cursor.x + camera.x,
      cursor.y + camera.y,
      cursor.size,
      cursor.size,
      entityCenterX,
      entityCenterY,
      entity.w * TILE_SIZE,
      entity.h * TILE_SIZE,
    );

    if (hovering) {
      hoveringAnyEntity = true;
      hoveredEntityId = entity.id;
    }
  });

  if (hoveringAnyEntity) {
    document.body.style.cursor = "pointer";
  } else if (!hoveringAnyEntity && document.body.style.cursor === "pointer") {
    document.body.style.cursor = "auto";
    hoveredEntityId = -1;
  }
});

canvas.addEventListener("mousedown", (event) => {
  const { top, left } = canvas.getBoundingClientRect();
  const clickX = event.clientX - left;
  const clickY = event.clientY - top;

  const clickWorldX = clickX + camera.x;
  const clickWorldY = clickY + camera.y;

  // Verify if the click hit something
  const clickedEntity = getEntityAtWorldPosition(clickWorldX, clickWorldY);

  if (clickedEntity) {
    const distanceFromPlayer = distance(
      player.x,
      player.y,
      clickedEntity.x + (clickedEntity.w * TILE_SIZE) / 2,
      clickedEntity.y + (clickedEntity.h * TILE_SIZE) / 2,
    );

    if (distanceFromPlayer < PLAYER_RANGE * TILE_SIZE) {
      handleEntityClick(clickedEntity);
    }
  }
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
  ctx.beginPath();
  ctx.arc(
    player.x - camera.x,
    player.y - camera.y,
    PLAYER_SIZE / 2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.closePath();
}

function drawPlayerRange() {
  ctx.strokeStyle = "#F5F5F5";
  ctx.beginPath();
  ctx.arc(
    player.x - camera.x,
    player.y - camera.y,
    PLAYER_RANGE * TILE_SIZE,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
  ctx.closePath();
}

function playerCanMoveThere(worldX: number, worldY: number) {
  const chunk = getChunkFromWorldPosition(worldX, worldY);

  if (!chunk) return false;

  const [chunkTileX, chunkTileY] = getChunkTileIndexFromWorldPosition(
    worldX,
    worldY,
  );

  // Verify if tile is walkable
  if (chunk[chunkTileX][chunkTileY] !== Tile.GRASS) {
    return false;
  }

  // Verify if there is any entity blocking movement
  for (const entity of entities) {
    const entityCenterX = entity.x + (entity.w * TILE_SIZE) / 2;
    const entityCenterY = entity.y + (entity.h * TILE_SIZE) / 2;

    const entityCollides = isColliding(
      worldX,
      worldY,
      PLAYER_SIZE,
      PLAYER_SIZE,
      entityCenterX,
      entityCenterY,
      entity.w * TILE_SIZE,
      entity.h * TILE_SIZE,
    );

    if (entityCollides) {
      return false;
    }
  }

  return true;
}

function movePlayer(deltaTime: number) {
  let direction = { x: 0, y: 0 };

  if (pressedKeys.has("w")) direction.y -= 1;
  if (pressedKeys.has("s")) direction.y += 1;
  if (pressedKeys.has("a")) direction.x -= 1;
  if (pressedKeys.has("d")) direction.x += 1;

  const length = Math.hypot(direction.x, direction.y);
  if (length > 0) {
    direction.x /= length;
    direction.y /= length;
  }

  const nextX = player.x + player.speed * direction.x * deltaTime;
  const nextY = player.y + player.speed * direction.y * deltaTime;

  if (playerCanMoveThere(nextX, nextY)) {
    player.x = nextX;
    player.y = nextY;
  } else if (playerCanMoveThere(nextX, player.y)) {
    player.x = nextX;
  } else if (playerCanMoveThere(player.x, nextY)) {
    player.y = nextY;
  }
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

async function main() {
  await loadAssets();

  createChunk(0, 0);
  generateChunksAround(player.x, player.y);

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
  updateDroppedItems();

  drawChunks();
  drawPlayer();
  drawEntities();

  // ui stuff
  drawInventory();

  if (debugModeEnabled) {
    drawPlayerRange();
    highlightChunks();
    drawEntitiesCenterpoints();
    drawCursor();
  }

  requestAnimationFrame(update);
}

main();
