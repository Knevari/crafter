import type { Component } from "./component";
import type { Sprite } from "./sprite";

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
