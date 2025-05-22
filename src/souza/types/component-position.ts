import type { Component } from "./component";

export interface PositionComponent extends Component {
  x: number;
  y: number;
};

export interface CharacterControlerComponent extends Component {
  direction: { x: number; y: number };
  speed: number;
  moving: boolean;
  lastDirection: "side" | "up" | "down" | "left" | "right";
}
