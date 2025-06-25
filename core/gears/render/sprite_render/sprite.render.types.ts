import type { Component } from "../../../types/component";
import type { Sprite } from "../../sprite/sprite.types.ts";

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
