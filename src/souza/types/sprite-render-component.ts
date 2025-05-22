import type { Component } from "./component";

export interface SpriteRenderComponent extends Component {
  spriteSheetId: string; 
  spriteRef: string; 
  scale?: number;
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}
