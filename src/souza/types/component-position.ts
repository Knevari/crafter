import type { Component } from "./component";
import type { Vector2 } from "./vector2";

export interface PositionComponent extends Vector2, Component{
  previousX?: number;
  previousY?: number;
};

export interface CharacterControlerComponent extends Component {
  direction: { x: number; y: number };
  speed: number;
  moving: boolean;
  lastDirection: "side" | "up" | "down" | "left" | "right";
}
