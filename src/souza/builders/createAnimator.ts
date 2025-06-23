import type { AnimatorComponent, AnimatorController } from "../types/animator";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { getId } from "./createId";

type AnimatorOptions = Partial<Omit<AnimatorComponent, "entity">>;

export function createAnimator(
  gameEntity: GameEntity,
  controller: AnimatorController,
  options: AnimatorOptions = {}
): AnimatorComponent {
  return {
     instanceId: getId(),
    type: ComponentType.ANIMATOR,
    gameEntity: gameEntity,
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
