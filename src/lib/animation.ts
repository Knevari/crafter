import { gameState } from "./game-state";
import type { Animator, Entity } from "./types";

export function updateAnimator(animator: Animator, deltaTime: number) {
  const anim = animator.animations[animator.current];

  if (gameState.gameTime - animator.startTime === 0) {
    anim.onStart?.();
  }

  if (
    anim.totalDuration &&
    gameState.gameTime - animator.startTime >= anim.totalDuration
  ) {
    animator.frame = anim.frames - 1;
    anim.onComplete?.();
    return;
  }

  animator.elapsed += deltaTime;

  if (animator.elapsed >= anim.frameDuration) {
    animator.frame = (animator.frame + 1) % anim.frames;
    animator.elapsed = 0;
  }
}

export function float(
  entity: Entity,
  speed: number = 10,
  amplitude: number = 0.5,
) {
  const now = Date.now() / 1000;
  entity.position.y += Math.cos(now * speed) * amplitude;
}
