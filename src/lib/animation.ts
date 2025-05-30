import { gameState } from "./game-state";
import type { Animator, GameEntity } from "./types";

export function updateAnimator(animator: Animator, deltaTime: number) {
  const animation = animator.animations[animator.current];

  if (gameState.gameTime - animator.startTime === 0) {
    animation.onStart?.();
  }

  if (
    animation.totalDuration &&
    gameState.gameTime - animator.startTime >= animation.totalDuration
  ) {
    animator.frame = animation.frames - 1;
    if (animation.onComplete) {
      animation.onComplete();
      animation.onComplete = undefined;
    }

    return;
  }

  animator.elapsed += deltaTime;

  if (animator.elapsed >= animation.frameDuration) {
    animator.frame = (animator.frame + 1) % animation.frames;
    animator.elapsed = 0;
  }
}

export function float(
  entity: GameEntity,
  speed: number = 10,
  amplitude: number = 0.5,
) {
  const now = Date.now() / 1000;
  entity.position.y += Math.cos(now * speed) * amplitude;
}
