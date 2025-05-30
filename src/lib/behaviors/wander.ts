import { prng, rand } from "../random";
import type { GameEntity } from "../types";

export function updateWanderBehavior(entity: GameEntity, deltaTime: number) {
  const wander = (entity.data.wander ??= {
    speed: 25,
    cooldown: 1,
    target: [0, 0],
    state: "idle",
  });

  wander.cooldown -= deltaTime;

  if (wander.cooldown <= 0) {
    const angle = prng() * Math.PI * 2;

    // coordinates of the place I wanna go
    const targetX = Math.cos(angle);
    const targetY = Math.sin(angle);

    const state = prng() < 0.5 ? "idle" : "walking";

    wander.cooldown = rand(2, 4);
    wander.state = state;
    wander.target = [targetX, targetY];
  }

  if (wander.state === "walking") {
    const dx = wander.target[0] * wander.speed * deltaTime;
    const dy = wander.target[1] * wander.speed * deltaTime;
    entity.position.x += dx;
    entity.position.y += dy;
  }
}
