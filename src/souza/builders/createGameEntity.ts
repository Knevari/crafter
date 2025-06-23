import type { GameEntity } from "../types/EngineEntity";
import { getId } from "./createId";

export function createGameEntity(
  name: string,
  tag = "untagged",
): GameEntity {
  return { id: getId(), name: name, tag: tag, acitve: true };
}
