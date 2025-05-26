import type { Component } from "./component";
import type { Sprite } from "./sprite";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface SpriteRenderComponent extends Component {
  sprite: Sprite | null; 
  scale?: number;
  rotation?: number;
  color: Color;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  layer: number;
  enabled: boolean;
}
