import type { Component } from "./component";

export interface CameraComponent extends Component {
  x: number;              
  y: number;    
  zoom: number;
  rotation: number;
}
