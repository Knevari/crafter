import { distance, mag } from "../math";
import { gameState } from "../game-state";
import { getEntityCenter } from "../entities";
import { getPath } from "../pathfinding/a-star";
import { type Entity } from "../types";
import { ENTITY_VISIBILITY_RANGE, PLAYER_SIZE, TILE_SIZE } from "../constants";

export function updateFollowPlayerBehavior(entity: Entity, deltaTime: number) {
  const followPlayer = (entity.data.followPlayer ??= {
    state: "following",
    speed: gameState.player.data.speed / 2,
    path: [],
    lastPlayerPosition: null,
  });

  const [entityCenterX, entityCenterY] = getEntityCenter(entity);
  const distanceFromPlayer = distance(
    gameState.player.position.x,
    gameState.player.position.y,
    entityCenterX,
    entityCenterY,
  );

  const [lastX, lastY] = followPlayer.lastPlayerPosition ?? [
    -gameState.player.position.x,
    -gameState.player.position.y,
  ];

  const isCloseEnough =
    distanceFromPlayer < ENTITY_VISIBILITY_RANGE * TILE_SIZE;

  const playerMovedEnough =
    distance(
      lastX,
      lastY,
      gameState.player.position.x,
      gameState.player.position.y,
    ) > PLAYER_SIZE;

  if (isCloseEnough && playerMovedEnough) {
    const pathToPlayer = getPath(
      entity.position.x,
      entity.position.y,
      gameState.player.position.x,
      gameState.player.position.y,
    );

    followPlayer.path = pathToPlayer;
    followPlayer.state = "following";
    followPlayer.lastPlayerPosition = [
      gameState.player.position.x,
      gameState.player.position.y,
    ];
    entity.data.moving = true;
  } else if (!isCloseEnough) {
    followPlayer.path = [];
    followPlayer.state = "idle";
    entity.data.moving = false;
  }

  // Follow Path
  if (followPlayer.state === "following") {
    const { path } = followPlayer;
    if (path && path.length > 0) {
      const nextPosition = path.at(0);
      if (nextPosition) {
        const dx = nextPosition.x - entity.position.x;
        const dy = nextPosition.y - entity.position.y;

        const dist = Math.hypot(dx, dy);

        const ARRIVAL_THRESHOLD = 5;

        if (dist < ARRIVAL_THRESHOLD) {
          entity.position.x = nextPosition.x;
          entity.position.y = nextPosition.y;
          followPlayer.path.shift();
        } else {
          const [nx, ny] = mag(dx, dy);
          entity.position.x += nx * followPlayer.speed * deltaTime;
          entity.position.y += ny * followPlayer.speed * deltaTime;
        }
      }
    }
  }
}
