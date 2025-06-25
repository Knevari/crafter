import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import type { SpriteRenderComponent } from "../gears/render/sprite_render/sprite.render.types";
import { getId } from "./createId";

type SpriteRenderOptions = Partial<Omit<SpriteRenderComponent, "entity">>;

export function createSpriteRender(
  gameEntity: GameEntity,
  options: SpriteRenderOptions = {}
): SpriteRenderComponent {
  return {
    instanceId: getId(),
    category: ComponentType.SPRITE_RENDER,
    type: ComponentType.SPRITE_RENDER,
    gameEntity: gameEntity,
    sprite: null,
    scale: 1,
    color: "white",
    alpha: 1.0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: 0,
    enabled: true,
    ...options,
  }
}
