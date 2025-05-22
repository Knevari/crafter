import type { Component } from "./component";
import type { Sprite } from "./sprite";

export interface SpriteRenderComponent extends Component {
  sprite: Sprite | null; 
  scale?: number;
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}
