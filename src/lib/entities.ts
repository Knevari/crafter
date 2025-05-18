import { float, updateAnimator } from "./animation";
import behaviors from "./behaviors";
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
import { ENTITY_DEFINITIONS } from "./entity-defs";
import { gameState } from "./game-state";
import { addToInventory } from "./inventory";
import { distance } from "./math";
import { createId, prng, rand, scaledNoise } from "./random";
import { EntityType, Tile, type ChunkKey, type Entity } from "./types";
import { isColliding } from "./utils/is-colliding";

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

export function createEntity(
  type: EntityType,
  worldX: number,
  worldY: number,
  width: number,
  height: number,
) {
  const id = createId();
  const def = ENTITY_DEFINITIONS[type];

  const drops = typeof def.drops === "function" ? def.drops() : def.drops;

  const entity: Entity = {
    id,
    type,
    sprite: def.sprite ?? null,
    animator: def.animator ?? null,
    hitbox: def.hitbox,
    behaviors: def.behaviors,
    position: {
      x: worldX,
      y: worldY,
    },
    dimensions: {
      width,
      height,
    },
    health: def.health,
    drops,
    data: {},
    inInventory: false,
  };

  gameState.entities.push(entity);
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
  const newEntityCenterY = worldY + (height * TILE_SIZE) / 2;

  const chunk = getChunkFromWorldPosition(worldX, worldY);
  const [tileX, tileY] = getChunkTileIndexFromWorldPosition(worldX, worldY);

  if (!chunk) {
    return false;
  }

  for (let dx = 0; dx < width; dx++) {
    for (let dy = 0; dy < height; dy++) {
      const tile = chunk[tileX + dx]?.[tileY + dx];
      if (tile !== Tile.GRASS) return false;
    }
  }

  for (const entity of gameState.entities) {
    const entityCenterX =
      entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2;
    const entityCenterY =
      entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2;

    const hitboxDimensions = getHitboxDimensions(entity);
    const hitboxOffsetY =
      (entity.hitbox.yOffset ?? 0) * entity.dimensions.height * TILE_SIZE;

    if (
      isColliding(
        newEntityCenterX,
        newEntityCenterY,
        width * TILE_SIZE,
        height * TILE_SIZE,
        entityCenterX,
        entityCenterY + hitboxOffsetY,
        entity.dimensions.width * TILE_SIZE,
        entity.dimensions.height * TILE_SIZE,
      )
    ) {
      return false;
    }
  }

  return true;
}

// TODO: REFACTOR THIS INTO SOMETHING MINIMALLY DECENT FOR FUCK SAKE
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
      if (randomValue < 0.3) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 4, 5)) {
          createEntity(EntityType.TREE, entityWorldX, entityWorldY, 4, 5);
        }
      }
      // if (randomValue > 0.4 && randomValue < 0.42) {
      //   if (canPlaceEntity(entityWorldX, entityWorldY, 1, 1)) {
      //     createEntity(EntityType.PIG, entityWorldX, entityWorldY, 1, 1);
      //   }
      // }
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
    if (entity.behaviors) {
      for (const behavior of entity.behaviors) {
        behaviors[behavior](entity, deltaTime);
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
          (dx / distanceFromPlayer) * gameState.player.data.speed * deltaTime;
        entity.position.y +=
          (dy / distanceFromPlayer) * gameState.player.data.speed * deltaTime;
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

export function getHitboxDimensions(entity: Entity) {
  return {
    width: entity.hitbox.xPercentage * TILE_SIZE * entity.dimensions.width,
    height: entity.hitbox.yPercentage * TILE_SIZE * entity.dimensions.height,
  };
}
