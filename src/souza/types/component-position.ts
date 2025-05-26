import type { Component } from "./component";
import type { Vector2 } from "./vector2";

export interface PositionComponent extends Vector2, Component{
  previousX?: number;
  previousY?: number;
};

export type CharacterState = "idle" | "walking" | "attacking";
export type FacingDirection = "up" | "down" | "side";

export interface CharacterControlerComponent extends Component {
  direction: Vector2;
  speed: number;
  runSpeed: number;
  moving: boolean;
  state: CharacterState;
  facing: FacingDirection;
}

