import type { BoxColliderComponent } from "../collider/types/BoxCollider";
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

