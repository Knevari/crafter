import type { Component } from "../ecs";

export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface StaticSpriteComponent extends Component {
  image: HTMLImageElement;
  width: number;      
  height: number;  
  spriteX: number;  
  spriteY?: number;
  tileSize: number; 
}
