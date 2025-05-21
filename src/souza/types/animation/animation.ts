export interface AnimationFrame {
  spriteIndex: number;
  duration?: number;
}

export interface SpriteAnimation {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
  frameRate: number;
}
