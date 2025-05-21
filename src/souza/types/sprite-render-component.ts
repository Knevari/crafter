import type { Component } from "./component";

export interface SpriteRenderComponent extends Component {
  spriteSheetId: string; 
  spriteName: string; 
  scale?: number;
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}
