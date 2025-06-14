import type { Vec2 } from "../Vec2/Vec2";
import type { Component } from "./component";

export type CharacterState = "idle" | "walking" | "attacking";
export type FacingDirection = "up" | "down" | "side";

export interface CharacterControlerComponent extends Component {
  direction: Vec2;
  speed: number;
  runSpeed: number;
  moving: boolean;
  state: CharacterState;
  facing: FacingDirection;
}