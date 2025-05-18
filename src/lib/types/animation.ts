export interface Animation {
  row: number;
  frames: number;
  frameDuration: number;
  totalDuration?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

export type AnimationSet = Record<string, Animation>;

export interface Animator {
  animations: AnimationSet;
  current: string;
  frame: number;
  elapsed: number;
  startTime: number;
}
