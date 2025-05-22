import type { BaseEntity } from "../../lib/types";
import { SLIME_IDLE_CLIP, SLIME_MOVE_CLIP } from "../game/slime_animations";
import type { AnimatorComponent } from "../types/animator";
import type { PositionComponent } from "../types/component-position";
import { ComponentType } from "../types/component-type";
import type { System } from "../types/system";
import type { ECSComponents } from "../ecs/ecs-components";
import PositionMath from "../helpers/position-math";

export default function FollowSystem(
    playerId: BaseEntity,
    enemyIds: BaseEntity[],
    speed: number,
    followRange: number = 300,
    stopRange: number = 10
): System {
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
                    const direction = PositionMath.normalize(PositionMath.subtract(playerPos, slimePos));
                    slimePos.x += direction.x * speed * deltaTime;
                    slimePos.y += direction.y * speed * deltaTime;

                    if (animator.currentClip !== SLIME_MOVE_CLIP) {
                        animator.currentClip = SLIME_MOVE_CLIP;
                        animator.currentFrameIndex = 0;
                        animator.time = 0;
                        animator.isPlaying = true;
                    }
                }
                else {

                    if (animator.currentClip !== SLIME_IDLE_CLIP) {
                        animator.currentClip = SLIME_IDLE_CLIP;
                        animator.currentFrameIndex = 0;
                        animator.time = 0;
                        animator.isPlaying = true;
                    }
                }
            }
        },
    };
}