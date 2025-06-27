import type { AnimatorComponent, AnimatorOptions } from "../gears/animator";
import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export function createAnimatorComponent(gameEntity: GameEntity, options: AnimatorOptions): AnimatorComponent {
    return {
        instanceId: createIncrementalId(),
        category: ComponentType.ANIMATOR,
        controller: null,
        currentClip: null,
        currentFrameIndex: 0,
        enabled: true,
        gameEntity: gameEntity,
        isPlaying: false,
        locked: false,
        playbackSpeed: 1,
        time: 0,
        type: ComponentType.ANIMATOR,
        ...options
    };
}