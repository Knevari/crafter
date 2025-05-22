import type { Sprite } from "./sprite";

export interface AnimationFrame {
  sprite: Sprite;
  duration?: number;
}

export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  frameRate: number; 
}


