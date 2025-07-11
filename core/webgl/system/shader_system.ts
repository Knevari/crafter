import type { GameEntity } from "../../types/EngineEntity";

export interface ShaderSystem {
    global?: () => void;
    local?: (gameEntity: GameEntity) => void;
}
