import type { BoxColliderComponent } from "./collider-box";
import type { Sprite } from "./sprite";

export interface AnimationFrame {
  sprite: Sprite;
  duration?: number;
  collider?: BoxColliderComponent;
}

export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  frameRate: number; 
}

export function createEasyAnimationClip(
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
