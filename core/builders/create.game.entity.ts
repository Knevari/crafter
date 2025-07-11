import { MANAGER } from "../managers/entity_manager";
import { generic_manager_add } from "../managers/generic_manager";
import type { GameEntity } from "../types/EngineEntity";
import { createIncrementalId } from "./create.incremental.id";

export enum Layer {
  Default = 1 << 0,
  Player = 1 << 1,
  Enemy = 1 << 2,
  UI = 1 << 3,
  IgnoreRaycast = 1 << 4,
  IgnoreDepthSorting = 1 << 5
}


export function createGameEntity(
  name: string,
  tag = "untagged",
  layerMask: Layer = Layer.Default
): GameEntity {

  const gameEntity: GameEntity = {
    parent: null,
    id: createIncrementalId(),
    name,
    tag,
    active: true,
    layerMask
  };

  generic_manager_add(MANAGER.GAME_ENTITY, gameEntity.id, gameEntity);

  return gameEntity;
}