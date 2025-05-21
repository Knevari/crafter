import Alea from "alea";
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
  ENTITY_DESPAWN_RANGE,
  ITEM_PICKUP_RANGE,
  PLAYER_RANGE,
  PLAYER_SIZE,
  SEED,
  TILE_SIZE,
} from "./constants";
import { ENTITY_DEFINITIONS } from "./entity-defs";
import { gameState } from "./game-state";
import { addToInventory } from "./inventory";
import { distance, map } from "./math";
import { createId, prng } from "./random";
import { EntityType, Tile, type ChunkKey, type Entity } from "./types";
import { isColliding } from "./utils/is-colliding";
import { createNoise2D } from "simplex-noise";
import { UI } from "./ui";

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
    case EntityType.SLIME: {
      return "SLIME";
    }
    case EntityType.SLIME_GREEN: {
      return "SLIME_GREEN";
    }
    case EntityType.SKELETON: {
      return "SKELETON";
    }
    case EntityType.AXE: {
      return "AXE";
    }
    case EntityType.CRAFTING_TABLE: {
      return "CRAFTING_TABLE";
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
    sprite: def.sprite ? { ...def.sprite } : null,
    animator: def.animator ? { ...def.animator } : null,
    collisionBox: { ...def.collisionBox },
    behaviors: [...def.behaviors],
    position: {
      x: worldX,
      y: worldY,
    },
    dimensions: {
      width,
      height,
    },
    health: {
      max: def.health.max,
      current: def.health.current,
    },
    drops,
    data: def.data ? { ...def.data } : { inventory: false },
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
        0.7,
        0.7,
      );
    }
  }

  // Delete from entities
  const entityIndex = gameState.entities.findIndex(
    (entity) => entity.id === entityId,
  );
  if (entityIndex > -1) gameState.entities.splice(entityIndex, 1);
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
      const tile = chunk[tileX + dx]?.[tileY + dy];
      if (tile !== Tile.GRASS) return false;
    }
  }

  for (const entity of gameState.entities) {
    const entityCenterX =
      entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2;
    const entityCenterY =
      entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2;

    const collisionBoxOffsetY =
      (entity.collisionBox.yOffset ?? 0) * entity.dimensions.height * TILE_SIZE;

    if (
      isColliding(
        newEntityCenterX,
        newEntityCenterY,
        width * TILE_SIZE,
        height * TILE_SIZE,
        entityCenterX,
        entityCenterY + collisionBoxOffsetY,
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

  const chunkSeed = `${SEED}-${chunkKey}`;
  const localPrng = Alea(chunkSeed);
  const localNoise = createNoise2D(localPrng);

  const scaledLocalNoise = (x: number, y: number) =>
    map(localNoise(x, y), -1, 1, 0, 1);

  for (let dx = 0; dx < CHUNK_SIZE; dx++) {
    for (let dy = 0; dy < CHUNK_SIZE; dy++) {
      const entityWorldX = chunkX * CHUNK_SIZE_IN_PIXELS + dx * TILE_SIZE;
      const entityWorldY = chunkY * CHUNK_SIZE_IN_PIXELS + dy * TILE_SIZE;

      const tileX = chunkX * TILE_SIZE + dx;
      const tileY = chunkY * TILE_SIZE + dy;

      const n = scaledLocalNoise(tileX / 32, tileY / 32);

      if (n < 0.1) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 1, 1)) {
          createEntity(EntityType.ROCK, entityWorldX, entityWorldY, 1, 1);
        }
      } else if (n < 0.3) {
        if (canPlaceEntity(entityWorldX, entityWorldY, 4, 5)) {
          createEntity(EntityType.TREE, entityWorldX, entityWorldY, 4, 5);
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

  const selectedItemIndex = gameState.selectedItemIndex;
  const selectedItem =
    selectedItemIndex > -1 ? gameState.inventory[selectedItemIndex] : null;

  const damage = selectedItem?.entity.data.baseDamage ?? 1;
  entity.health.current -= damage;

  const extraDamagePercent = selectedItem?.entity.data.extraDamagePercent ?? 0;
  const extraDamageTo = selectedItem?.entity.data.extraDamageTo ?? [];

  if (Array.isArray(extraDamageTo) && extraDamageTo.indexOf(entity.type) > -1) {
    entity.health.current -= damage * extraDamagePercent;
  }

  if (entity.health.current <= 0) {
    destroyEntity(entity.id);
  }
}

export function getEntityCenter(entity: Entity) {
  return [
    entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2,
    entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2,
  ];
}

export function updateEntities(deltaTime: number) {
  const camera = gameState.camera;
  const playerPosition = gameState.player.position;

  for (const entity of gameState.entities) {
    if (entity.behaviors) {
      for (const behavior of entity.behaviors) {
        behaviors[behavior](entity, deltaTime);
      }
    }

    if (entity.data.item) {
      float(entity);
    }

    if (entity.animator) {
      updateAnimator(entity.animator, deltaTime);
    }

    if (entity.type === EntityType.CRAFTING_TABLE) {
      const entityDimensions = entity.dimensions;
      const [entityCenterX, entityCenterY] = getEntityCenter(entity);
      const distanceFromPlayer = distance(
        playerPosition.x,
        playerPosition.y,
        entityCenterX,
        entityCenterY,
      );

      UI.text.openCraftingTable.setPosition(
        entityCenterX - camera.position.x,
        entityCenterY - camera.position.y - entityDimensions.height * TILE_SIZE,
      );

      if (distanceFromPlayer < PLAYER_RANGE * TILE_SIZE) {
        UI.text.openCraftingTable.fadeIn();
      } else {
        UI.text.openCraftingTable.fadeOut();
      }
    }
  }

  updatePigAnimation(deltaTime);
}

function updatePigAnimation(deltaTime: number) {
  for (const entity of gameState.entities) {
    if (
      entity.type === EntityType.PIG &&
      entity.data.moving &&
      entity.animator
    ) {
      entity.animator.current = "walk";
    }
    if (
      entity.type == EntityType.PIG &&
      !entity.data.moving &&
      entity.animator
    ) {
      entity.animator.current = "idle";
    }
  }
}

export function updateDroppedItems(deltaTime: number) {
  for (const entity of gameState.entities) {
    if (entity.data.item) {
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
          (dx / distanceFromPlayer) *
          gameState.player.data.speed *
          1.2 *
          deltaTime;
        entity.position.y +=
          (dy / distanceFromPlayer) *
          gameState.player.data.speed *
          1.2 *
          deltaTime;
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
        UI.inventory.update();
      }
    }
  }
}

export function getCollisionBoxDimensions(entity: Entity) {
  return {
    width:
      entity.collisionBox.xPercentage * TILE_SIZE * entity.dimensions.width,
    height:
      entity.collisionBox.yPercentage * TILE_SIZE * entity.dimensions.height,
  };
}

export function cullDistantEntities() {
  const playerChunk = getChunkFromWorldPosition(
    gameState.player.position.x,
    gameState.player.position.y,
  );

  if (!playerChunk) return;

  const playerChunkX = Math.floor(
    gameState.player.position.x / CHUNK_SIZE_IN_PIXELS,
  );
  const playerChunkY = Math.floor(
    gameState.player.position.y / CHUNK_SIZE_IN_PIXELS,
  );

  gameState.entities = gameState.entities.filter((entity) => {
    if (entity.data.inventory) return true; // never despawn inventory items

    const entityChunkX = Math.floor(entity.position.x / CHUNK_SIZE_IN_PIXELS);
    const entityChunkY = Math.floor(entity.position.y / CHUNK_SIZE_IN_PIXELS);

    const dx = Math.abs(entityChunkX - playerChunkX);
    const dy = Math.abs(entityChunkY - playerChunkY);

    return dx <= ENTITY_DESPAWN_RANGE && dy <= ENTITY_DESPAWN_RANGE;
  });
}
