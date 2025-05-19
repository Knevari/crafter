import { distance, mag } from "../math";
import { gameState } from "../game-state";
import { getEntityCenter } from "../entities";
import { getPath } from "../pathfinding/a-star";
import { type Entity } from "../types";

export function updateFollowPlayerBehavior(entity: Entity, deltaTime: number) {
  const followPlayer = (entity.data.followPlayer ??= {
    state: "following",
    speed: gameState.player.data.speed,
  });

  const [entityCenterX, entityCenterY] = getEntityCenter(entity);
  const distanceFromPlayer = distance(
    gameState.player.position.x,
    gameState.player.position.y,
    entityCenterX,
    entityCenterY,
  );

  if (distanceFromPlayer < 50) {
    followPlayer.state = "idle";
    entity.data.moving = false;
  } else {
    followPlayer.state = "following";
    entity.data.moving = true;
  }

  if (followPlayer.state === "following") {
    const path = getPath(
      entity.position.x,
      entity.position.y,
      gameState.player.position.x,
      gameState.player.position.y,
    );

    if (path && path.length) {
      const nextPosition = path[path.length - 2];
      if (nextPosition) {
        const dx = nextPosition.x - entity.position.x;
        const dy = nextPosition.y - entity.position.y;
        const [nx, ny] = mag(dx, dy);

        entity.position.x += nx * followPlayer.speed * deltaTime;
        entity.position.y += ny * followPlayer.speed * deltaTime;
      }
    }
  }
}
