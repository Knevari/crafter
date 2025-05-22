import type { AnimationClip } from "../types/animation";
import type { AnimatorController } from "../types/animator";
import { Manager } from "./generic-manager";

export const animatorControllerManager = new Manager<AnimatorController>("AnimatorControllerManager");
export const animationClipManager = new Manager<AnimationClip>("AnimationClipManager")