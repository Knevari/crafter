import type { AnimationClip, AnimationFrame } from "./animation.types";

export function createAnimationClip(
  name: string,
  texture: string,
  frameCount: number,
  startX: number,
  startY: number,
  frameWidth: number,
  frameHeight: number,
  frameRate: number = 12,
  frameSpacing: number = 0,
): AnimationClip {
  const frames = [];

  for (let i = 0; i < frameCount; i++) {
    const frame: AnimationFrame = {
      sprite: {
        meshName: "quad_mesh",
        textureName: texture,
        position: {
          x: startX + i * (frameWidth + frameSpacing),
          y: startY,
        },
        size: {
          x: frameWidth,
          y: frameHeight,
        },
        origin: { x: -0, y: -0 },
      },
    };

    frames.push(frame);
  }

  return {
    name,
    frames,
    frameRate,
  };
}
