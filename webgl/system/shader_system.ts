import type { GameEntity } from "../../core/types/EngineEntity";
import type { ECSComponentState, SpriteRenderComponent, TransformComponent } from "../../engine/types";

export interface ShaderSystem {
    global?: (gl: WebGL2RenderingContext, camera: GameEntity, componentState: ECSComponentState) => void;
    local?: (gl: WebGL2RenderingContext, spriteRender: SpriteRenderComponent, transform: TransformComponent) => void;
}
