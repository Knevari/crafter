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


export interface AnimatorComponent {
  currentAnimation: string;
  currentFrameIndex: number;
  time: number;
  playing: boolean;
  animations: Record<string, SpriteAnimation>;
}
