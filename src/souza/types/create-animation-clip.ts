import type { AnimationClip } from "./animation";
import type { BoxColliderComponent } from "./collider-box";

export function createAnimationClip(
  name: string,
  textureRef: string,
  frameCount: number,
  startX: number,
  startY: number,
  frameWidth: number,
  frameHeight: number,
  frameRate: number = 12,
  colliders?: (BoxColliderComponent | null)[]
): AnimationClip {
  const frames = [];

  for (let i = 0; i < frameCount; i++) {
    const frame: any = {
      sprite: {
        textureRef,
        x: startX + i * frameWidth,
        y: startY,
        width: frameWidth,
        height: frameHeight,
      },
    };

    if (colliders && colliders[i]) {
      frame.collider = colliders[i];
    }

    frames.push(frame);
  }

  return {
    name,
    frames,
    frameRate,
  };
}
