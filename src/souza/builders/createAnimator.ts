import type { Entity } from "../../lib/types";
import type { AnimatorComponent, AnimatorController } from "../types/animator";
import { ComponentType } from "../types/component-type";
import { getId } from "./createId";

type AnimatorOptions = Partial<Omit<AnimatorComponent, "entity">>;

export function createAnimator(
  entity: Entity,
  controller: AnimatorController,
  options: AnimatorOptions = {}
): AnimatorComponent {
  return {
     instanceId: getId(),
    type: ComponentType.ANIMATOR,
    entityRef: entity,
    enabled: true,
    controller,
    currentClip: null,
    isPlaying: false,
    time: 0,
    locked: false,
    currentFrameIndex: 0,
    playbackSpeed: 1,
    ...options,
  };
}
