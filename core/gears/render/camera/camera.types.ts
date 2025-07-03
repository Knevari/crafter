import type { Component } from "../../component/component";

export interface CameraComponent extends Component {
  near: number;
  far: number;
  fov: number;
  aspec: number;
}