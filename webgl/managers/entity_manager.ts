import type { GameEntity } from "../../core/types/EngineEntity";
import { createGenericManager } from "./generic_manager";

export const entityManager = createGenericManager<GameEntity, number>("entity_manager");