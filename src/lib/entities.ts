import { float, updateAnimator } from "./animation";
import {
  getChunkFromWorldPosition,
  getChunkPositionFromKey,
  getChunkTileIndexFromWorldPosition,
} from "./chunks";
import {
  CHUNK_SIZE,
  CHUNK_SIZE_IN_PIXELS,
  ITEM_PICKUP_RANGE,
  PLAYER_RANGE,
  TILE_SIZE,
} from "./constants";
import { gameState } from "./game-state";
import { addToInventory } from "./inventory";
import { distance } from "./math";
import { createId, prng, rand, scaledNoise } from "./random";
import {
  EntityType,
  Tile,
  type Animator,
  type ChunkKey,
  type DropItem,
  type Entity,
  type HitBox,
  type Sprite,
} from "./types";
import { isColliding } from "./utils/is-colliding";

export function getEntityHealth(type: EntityType) {
  switch (type) {
    case EntityType.PIG: {
      return {
        current: 3,
        max: 3,
      };
    }
    default: {
      return {
        current: 1,
        max: 1,
      };
    }
  }
}

export function getEntityDrops(type: EntityType) {
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
      break;
    }
    case EntityType.PIG: {
      drops.push({
        type: 1,
        quantity: EntityType.ITEM_ROCK,
      });
      break;
    }
  }
  return drops;
}

export function getEntitySprite(type: EntityType): Sprite | null {
  switch (type) {
    case EntityType.TREE: {
      return {
        sourceX: 0,
        sourceY: 0,
        sourceW: 4,
        sourceH: 5,
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
    case EntityType.PIG: {
      return {
        sourceX: 0,
        sourceY: 0,
        sourceW: 1,
        sourceH: 1,
      };
    }
    default: {
      return null;
    }
  }
}

function getEntityHitbox(type: EntityType): HitBox {
  switch (type) {
    case EntityType.TREE: {
      return {
        xPercentage: 0.2,
        yPercentage: 0.2,
        yOffset: 0.2,
      };
    }
    default: {
      return {
        xPercentage: 0.8,
        yPercentage: 0.8,
      };
    }
  }
}

export function getEntityTypeAsString(type: EntityType) {
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
    case EntityType.PIG: {
      return "PIG";
    }
    default: {
      return "UNKNOWN";
    }
  }
}

export function getEntityAnimator(type: EntityType): Animator | null {
  switch (type) {
    case EntityType.PIG: {
      return {
        animations: {
          idle: {
            row: 0,
            frames: 2,
            frameDuration: 0.15,
          },
          walk: {
            row: 1,
            frames: 2,
            frameDuration: 0.15,
          },
        },
        current: "idle",
        elapsed: 0,
        frame: 0,
        startTime: 0,
      };
    }
    default: {
      return null;
    }
  }
}

export function createEntity(
  type: EntityType,
  worldX: number,
  worldY: number,
  width: number,
  height: number,
) {
  const id = createId();
  const drops = getEntityDrops(type);
  const health = getEntityHealth(type);
  const sprite = getEntitySprite(type);
  const animator = getEntityAnimator(type);
  const hitbox = getEntityHitbox(type);
  gameState.entities.push({
    id,
    type,
    sprite,
    animator,
    hitbox,
    position: {
      x: worldX,
      y: worldY,
    },
    dimensions: {
      width,
      height,
    },
    health,
    drops,
    inInventory: false,
  });
}

export function destroyEntity(entityId: string) {
  const entity = gameState.entities.find((entity) => entity.id === entityId);
  if (!entity) return;

  // Drop its items
  for (const drop of entity.drops) {
    const dropProbability = drop.chance ?? 1;
    if (prng() < dropProbability) {
      createEntity(
        drop.type,
        entity.position.x +
          (entity.dimensions.width * TILE_SIZE) / 2 -
          TILE_SIZE / 2,
        entity.position.y +
          entity.dimensions.height * TILE_SIZE -
          TILE_SIZE * 2,
        1,
        1,
      );
    }
  }

  // Delete from entities
  const entityIndex = gameState.entities.findIndex(
    (entity) => entity.id === entityId,
  );
  if (entityIndex !== -1) gameState.entities.splice(entityIndex, 1);
}

export function canPlaceEntity(
  worldX: number,
  worldY: number,
  width: number,
  height: number,
) {
  const newEntityCenterX = worldX + (width * TILE_SIZE) / 2;
  const newEntityCenterY = worldY + (width * TILE_SIZE) / 2;

  const chunk = getChunkFromWorldPosition(worldX, worldY);
  const [tileX, tileY] = getChunkTileIndexFromWorldPosition(worldX, worldY);

  for (const entity of gameState.entities) {
    const entityCenterX =
      entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2;
    const entityCenterY =
      entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2;

    if (
      isColliding(
        newEntityCenterX,
        newEntityCenterY,
        width * TILE_SIZE,
        height * TILE_SIZE,
        entityCenterX,
        entityCenterY,
        entity.dimensions.width * TILE_SIZE,
        entity.dimensions.height * TILE_SIZE,
      )
    ) {
      return false;
    }

    for (let dx = 0; dx < entity.dimensions.width; dx++) {
      for (let dy = 0; dy < entity.dimensions.height; dy++) {
        if (chunk && chunk[tileX][tileY] !== Tile.GRASS) {
          return false;
        }
      }
    }
  }

  return true;
}

export function spawnChunkEntities(chunkKey: ChunkKey) {
  const [chunkX, chunkY] = getChunkPositionFromKey(chunkKey);

  for (let dx = 0; dx < CHUNK_SIZE; dx++) {
    for (let dy = 0; dy < CHUNK_SIZE; dy++) {
      const entityWorldX = chunkX * CHUNK_SIZE_IN_PIXELS + dx * TILE_SIZE;
      const entityWorldY = chunkY * CHUNK_SIZE_IN_PIXELS + dy * TILE_SIZE;

      const tileX = chunkX * TILE_SIZE + dx;
      const tileY = chunkY * TILE_SIZE + dy;

      const randomValue = scaledNoise(tileX / 32, tileY / 32);

      if (randomValue < 0.02) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 1, 1)) {
          createEntity(EntityType.ROCK, entityWorldX, entityWorldY, 1, 1);
        }
      }
      if (randomValue < 0.2) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 4, 5)) {
          createEntity(EntityType.TREE, entityWorldX, entityWorldY, 4, 5);
        }
      }
      if (randomValue > 0.4 && randomValue < 0.42) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 1, 1)) {
          createEntity(EntityType.PIG, entityWorldX, entityWorldY, 1, 1);
        }
      }
    }
  }
}

export function getEntityAtWorldPosition(worldX: number, worldY: number) {
  for (const entity of gameState.entities) {
    const { position: entityPosition, dimensions: entityDimensions } = entity;
    if (
      worldX >= entityPosition.x &&
      worldX <= entityPosition.x + entityDimensions.width * TILE_SIZE &&
      worldY >= entityPosition.y &&
      worldY <= entityPosition.y + entityDimensions.height * TILE_SIZE
    ) {
      return entity;
    }
  }
  return null;
}

export function handleEntityClick(entity: Entity) {
  if (gameState.debug) {
    console.log(
      `Clicked ${getEntityTypeAsString(entity.type)} at`,
      entity.position.x,
      entity.position.y,
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

export function getEntityCenter(entity: Entity) {
  return [
    entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2,
    entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2,
  ];
}

export function updateEntities(deltaTime: number) {
  for (const entity of gameState.entities) {
    if (entity.type === EntityType.PIG) {
      // move randomly
      const chanceOfMoving = prng();
      if (chanceOfMoving < 0.2) {
        const dx = rand(-1, 2);
        const dy = rand(-1, 2);
        entity.position.x += dx;
        entity.position.y += dy;
      }
    }

    if (entity.animator) {
      updateAnimator(entity.animator, deltaTime);
    }
  }
}

export function updateDroppedItems(deltaTime: number) {
  for (const entity of gameState.entities) {
    if (getEntityTypeAsString(entity.type).startsWith("ITEM_")) {
      const distanceFromPlayer = distance(
        gameState.player.position.x,
        gameState.player.position.y,
        entity.position.x,
        entity.position.y,
      );

      if (distanceFromPlayer < PLAYER_RANGE * TILE_SIZE) {
        const dx = gameState.player.position.x - entity.position.x;
        const dy = gameState.player.position.y - entity.position.y;

        entity.position.x +=
          (dx / distanceFromPlayer) * gameState.player.speed * deltaTime;
        entity.position.y +=
          (dy / distanceFromPlayer) * gameState.player.speed * deltaTime;
      } else {
        float(entity);
      }

      if (distanceFromPlayer < ITEM_PICKUP_RANGE * TILE_SIZE) {
        if (gameState.debug) {
          console.log(
            `Picked up ${getEntityTypeAsString(entity.type)} from`,
            entity.position.x,
            entity.position.y,
          );
        }
        addToInventory(entity);
        destroyEntity(entity.id);
      }
    }
  }
}
