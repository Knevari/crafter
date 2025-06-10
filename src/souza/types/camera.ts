import type TransformComponent from "../components/transform";
import type { Component } from "./component";

export interface CameraComponent extends Component {
  transform: TransformComponent;   
  zoom: number;
}
