import type { BaseEntity } from "../../lib/types";
import { setAnimatorState, type AnimatorComponent } from "../types/animator";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { System } from "../types/system";
import type { ECSComponents } from "../ecs/ecs-components";
import PositionMath from "../helpers/position-math";

export default function FollowSystem(
    playerId: BaseEntity,
    enemyIds: BaseEntity[],
    baseSpeed: number,
    followRange: number = 300,
    stopRange: number = 10
): System {
    const speedVariation = new Map<BaseEntity, number>();
    const jitterVariation = new Map<BaseEntity, number>();

    for (const enemy of enemyIds) {
        const speedFactor = 1 + (Math.random() * 0.2 - 0.1); 
        speedVariation.set(enemy, speedFactor);

        const jitterStrength = Math.random() * 0.2;
        jitterVariation.set(enemy, jitterStrength);
    }

    return {
        update(ecs: ECSComponents, deltaTime: number) {
            const playerPos = ecs.getComponent<PositionComponent>(playerId, ComponentType.Position);
            if (!playerPos) return;

            for (const slimeId of enemyIds) {
                const slimePos = ecs.getComponent<PositionComponent>(slimeId, ComponentType.Position);
                if (!slimePos) continue;

                const animator = ecs.getComponent<AnimatorComponent>(slimeId, ComponentType.Animator);
                if (!animator) continue;

                const dist = PositionMath.distance(slimePos, playerPos);

                if (dist <= followRange && dist > stopRange) {
                    let direction = PositionMath.normalize(PositionMath.subtract(playerPos, slimePos));

                    const jitterAmount = jitterVariation.get(slimeId) ?? 0;
                    const jitter = {
                        x: (Math.random() - 0.5) * jitterAmount,
                        y: (Math.random() - 0.5) * jitterAmount,
                    };

                    direction = PositionMath.normalize({
                        x: direction.x + jitter.x,
                        y: direction.y + jitter.y,
                    });

                    const speedFactor = speedVariation.get(slimeId) ?? 1;
                    const effectiveSpeed = baseSpeed * speedFactor;

                    slimePos.x += direction.x * effectiveSpeed * deltaTime;
                    slimePos.y += direction.y * effectiveSpeed * deltaTime;

                    setAnimatorState(animator, "move");
                } else {
                    setAnimatorState(animator, "idle");
                 
                }
            }
        },
    };
}
