import type { AnimationClip } from "../types/animation";
import type { AnimatorController } from "../types/animator";
import type { SpriteSheet } from "../types/sprite-sheet";
import { Manager } from "./generic-manager";

export const animatorControllerManager = new Manager<AnimatorController>("AnimatorControllerManager");
export const spriteSheetManager = new Manager<SpriteSheet>("SpriteSheetManager");
export const animationClipManager = new Manager<AnimationClip>("AnimationClipManager")