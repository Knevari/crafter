import type { Entity } from "../../lib/types";
import { ComponentType } from "../types/component-type";
import type { SpriteRenderComponent } from "../types/sprite-render-component";
import { getId } from "./createId";

type SpriteRenderOptions = Partial<Omit<SpriteRenderComponent, "entity">>;

export function createSpriteRender(
  entity: Entity,
  options: SpriteRenderOptions = {}
): SpriteRenderComponent {
  return {
    instanceId: getId(),
    type: ComponentType.SPRITE_RENDER,
    entityRef: entity,
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
