import { ComponentType } from "../types/component-type";
import type { GameEntity } from "../types/EngineEntity";
import type { SpriteRenderComponent, SpriteRenderOptions } from "../gears/render/sprite_render/sprite.render.types";
import { createIncrementalId } from "./create.incremental.id";

export function createSpriteRenderComponent(
  gameEntity: GameEntity,
  options: SpriteRenderOptions = {}
): SpriteRenderComponent {
  return {
    materialName: "simple_material",
    meshName: "quad_mesh",
    instance: createIncrementalId(),
    category: ComponentType.SPRITE_RENDER,
    type: ComponentType.SPRITE_RENDER,
    gameEntity: gameEntity,
    sprite: null,
    color: { r: 1, g: 1, b: 1, a: 1 },
    alpha: 1.0,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    layer: 0,
    enabled: true,
    ...options,
  }
}