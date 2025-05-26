import type { Component } from "./component";

export interface BoxColliderComponent extends Component {
  width: number;     
  height: number;     
  offsetX?: number;    
  offsetY?: number;  
  isStatic?: boolean;  
}
