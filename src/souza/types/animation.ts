export interface AnimationFrame {
  spriteName: string;
  duration?: number;
}

export interface AnimationClip {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  frameRate: number;
}


export type Animations = Record<string, AnimationClip>;