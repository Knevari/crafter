import { getEntityCenter } from "../entities";
import { gameState } from "../game-state";
import { distance, mag } from "../math";
import type { Entity } from "../types";

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

  if (distanceFromPlayer < 100) {
    followPlayer.state = "idle";
  } else {
    followPlayer.state = "following";
  }

  if (followPlayer.state === "following") {
    const dx = gameState.player.position.x - entity.position.x;
    const dy = gameState.player.position.y - entity.position.y;
    const [nx, ny] = mag(dx, dy);

    entity.position.x += nx * followPlayer.speed * deltaTime;
    entity.position.y += ny * followPlayer.speed * deltaTime;
  }
}
