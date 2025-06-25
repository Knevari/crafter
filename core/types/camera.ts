import type TransformComponent from "../gears/transform/transform.types";
import type { Component } from "./component";

export interface CameraComponent extends Component {
  transform: TransformComponent;   
  zoom: number;
}
