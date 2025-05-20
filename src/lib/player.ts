import { updateAnimator } from "./animation";
import {
  getChunkFromWorldPosition,
  getChunkTileIndexFromWorldPosition,
  getChunkTopLeftCorner,
  getRandomChunkKey,
} from "./chunks";
import { CHUNK_SIZE, PLAYER_SIZE, TILE_SIZE } from "./constants";
import { getCollisionBoxDimensions } from "./entities";
import { gameState } from "./game-state";
import { pressedKeys } from "./input";
import { mag } from "./math";
import { Tile, type ChunkKey } from "./types";
import { isColliding } from "./utils/is-colliding";

export function spawnPlayer() {
  const chunkKey = getRandomChunkKey();
  const chunk = gameState.chunks[chunkKey as ChunkKey];
  const [chunkTopLeftX, chunkTopLeftY] = getChunkTopLeftCorner(
    chunkKey as ChunkKey,
  );

  if (!chunk) {
    throw new Error("Impossivel encontrar chunk aleatoria");
  }

  for (let i = 0; i < CHUNK_SIZE; i++) {
    for (let j = 0; j < CHUNK_SIZE; j++) {
      const tile = chunk[i][j];

      if (tile === Tile.GRASS) {
        gameState.player.position.x = chunkTopLeftX + i * TILE_SIZE;
        gameState.player.position.y = chunkTopLeftY + j * TILE_SIZE;
      }
    }
  }
}

export function getPlayerCenter() {
  return [
    gameState.player.position.x + PLAYER_SIZE / 2,
    gameState.player.position.y + PLAYER_SIZE / 2,
  ];
}

export function updatePlayerAnimationState() {
  if (!gameState.player.animator) {
    return;
  }

  if (gameState.player.data.attacking) {
    if (!gameState.player.data.lockedDirection) {
      gameState.player.data.lockedDirection = gameState.player.data.direction;
    }
  } else {
    gameState.player.data.lockedDirection = null;
  }

  const prefix = gameState.player.data.attacking
    ? "attack"
    : gameState.player.data.moving
      ? "walk"
      : "idle";

  const animationDirection =
    gameState.player.data.lockedDirection ?? gameState.player.data.direction;

  const newKey = `${prefix}-${animationDirection}`;

  if (gameState.player.animator.current !== newKey) {
    gameState.player.animator.current = newKey;
    gameState.player.animator.frame = 0;
    gameState.player.animator.elapsed = 0;
    gameState.player.animator.startTime = gameState.gameTime;

    if (prefix === "attack") {
      const animation = gameState.player.animator.animations[newKey];
      if (!animation.onComplete) {
        animation.onComplete = () => {
          gameState.player.data.attacking = false;
        };
      }
    }
  }
}

export function updatePlayer(deltaTime: number) {
  if (!gameState.player.animator) {
    return;
  }
  let direction = { x: 0, y: 0 };

  if (pressedKeys.has("w")) direction.y -= 1;
  if (pressedKeys.has("s")) direction.y += 1;
  if (pressedKeys.has("a")) direction.x -= 1;
  if (pressedKeys.has("d")) direction.x += 1;

  if (direction.x === 1) {
    gameState.player.data.direction = "right";
    gameState.player.data.moving = true;
  } else if (direction.x === -1) {
    gameState.player.data.direction = "left";
    gameState.player.data.moving = true;
  } else if (direction.y === -1) {
    gameState.player.data.direction = "up";
    gameState.player.data.moving = true;
  } else if (direction.y === 1) {
    gameState.player.data.direction = "down";
    gameState.player.data.moving = true;
  } else {
    gameState.player.data.direction = "down";
    gameState.player.data.moving = false;
  }

  const [normalizedX, normalizedY] = mag(direction.x, direction.y);
  direction.x = normalizedX;
  direction.y = normalizedY;

  const nextX =
    gameState.player.position.x +
    gameState.player.data.speed * direction.x * deltaTime;
  const nextY =
    gameState.player.position.y +
    gameState.player.data.speed * direction.y * deltaTime;

  if (playerCanMoveThere(nextX, nextY)) {
    gameState.player.position.x = nextX;
    gameState.player.position.y = nextY;
  } else if (playerCanMoveThere(nextX, gameState.player.position.y)) {
    gameState.player.position.x = nextX;
  } else if (playerCanMoveThere(gameState.player.position.x, nextY)) {
    gameState.player.position.y = nextY;
  }

  updatePlayerAnimationState();
  updateAnimator(gameState.player.animator, deltaTime);
}

function playerCanMoveThere(worldX: number, worldY: number) {
  const chunk = getChunkFromWorldPosition(worldX, worldY);

  if (!chunk) return false;

  const [chunkTileX, chunkTileY] = getChunkTileIndexFromWorldPosition(
    worldX,
    worldY,
  );

  // Verify if tile is walkable
  if (chunk[chunkTileX]?.[chunkTileY] !== Tile.GRASS) {
    return false;
  }

  // Verify if there is any entity blocking movement
  for (const entity of gameState.entities) {
    const entityCenterX =
      entity.position.x + (entity.dimensions.width * TILE_SIZE) / 2;
    const entityCenterY =
      entity.position.y + (entity.dimensions.height * TILE_SIZE) / 2;

    const collisionBoxDimensions = getCollisionBoxDimensions(entity);
    const collisionBoxOffsetY =
      (entity.collisionBox.yOffset ?? 0) * entity.dimensions.height * TILE_SIZE;

    const entityCollides = isColliding(
      worldX,
      worldY,
      collisionBoxDimensions.width,
      collisionBoxDimensions.height,
      entityCenterX,
      entityCenterY + collisionBoxOffsetY,
      collisionBoxDimensions.width,
      collisionBoxDimensions.height,
    );

    if (entityCollides) {
      return false;
    }
  }

  return true;
}
