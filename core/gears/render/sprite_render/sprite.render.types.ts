import type { Component, ComponentOptions } from "../../component/component.ts";
import type { Sprite } from "../../sprite/sprite.types.ts";

export type SpriteRenderOptions = ComponentOptions<SpriteRenderComponent>;

export interface SpriteRenderComponent extends Component {
  sprite: Sprite | null; 
  scale?: number;
  rotation?: number;
  color?: string;
  alpha?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  layer: number;
  enabled: boolean;
}

