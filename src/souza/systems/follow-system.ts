import type { Entity } from "../../lib/types";
import { setAnimatorState, type AnimatorComponent } from "../types/animator";
import { ComponentType } from "../types/component-type";
import type { System } from "../types/system";
import type { ECSComponents } from "../ecs/ecs-components";
import Vec2 from "../helpers/vec2-math";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import type TransformComponent from "../components/transform";

export default function FollowSystem(
  playerId: Entity,
  enemyIds: Entity[],
  baseSpeed: number,
  followRange: number = 300,
  stopRange: number = 10
): System {
  const speedVariation = new Map<Entity, number>();
  const jitterVariation = new Map<Entity, number>();

  for (const enemy of enemyIds) {
    const speedFactor = 1 + (Math.random() * 0.2 - 0.1);
    speedVariation.set(enemy, speedFactor);

    const jitterStrength = Math.random() * 0.2;
    jitterVariation.set(enemy, jitterStrength);
  }

  return {
    update(ecs: ECSComponents, deltaTime: number) {
      const playerTransform = ecs.getComponent<TransformComponent>(playerId, ComponentType.TRANSFORM);
      if (!playerTransform || !playerTransform.enabled) return;

      for (const slimeId of enemyIds) {
        const slimeTransform = ecs.getComponent<TransformComponent>(slimeId, ComponentType.TRANSFORM);
        if (!slimeTransform) continue;

        const animator = ecs.getComponent<AnimatorComponent>(slimeId, ComponentType.ANIMATOR);
        if (!animator) continue;

        const spriteRender = ecs.getComponent<SpriteRenderComponent>(slimeId, ComponentType.SPRITE_RENDER);

        const dist = Vec2.distance(slimeTransform.position, playerTransform.position);

        if (dist <= followRange && dist > stopRange) {
          let direction = Vec2.normalize(Vec2.subtract(playerTransform.position, slimeTransform.position));

          const jitterAmount = jitterVariation.get(slimeId) ?? 0;
          const jitter = {
            x: (Math.random() - 0.5) * jitterAmount,
            y: (Math.random() - 0.5) * jitterAmount,
          };

          direction = Vec2.normalize({
            x: direction.x + jitter.x,
            y: direction.y + jitter.y,
          });

          const speedFactor = speedVariation.get(slimeId) ?? 1;
          const effectiveSpeed = baseSpeed * speedFactor;

          slimeTransform.position.x += direction.x * effectiveSpeed * deltaTime;
          slimeTransform.position.y += direction.y * effectiveSpeed * deltaTime;

          // FLIP HORIZONTAL baseado na direção x
          if (spriteRender) {
            if (direction.x < -0.1) {
              spriteRender.flipHorizontal = true;  // olhando para esquerda
            } else if (direction.x > 0.1) {
              spriteRender.flipHorizontal = false; // olhando para direita
            }
          }

          setAnimatorState(animator, "move");
        } else {
          setAnimatorState(animator, "idle");
        }
      }
    },
  };
}
