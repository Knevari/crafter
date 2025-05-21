import type { SpriteAnimation } from "../animation/animation";
import type { AnimatorController } from "./animator-controler";

export interface AnimatorComponent {
  controller: AnimatorController;
  currentAnimation: string;
  currentFrameIndex: number;
  time: number;
  playing: boolean;
  animations: Record<string, SpriteAnimation>;
}
