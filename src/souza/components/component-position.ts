import type { Component } from "../ecs";

export interface PositionComponent extends Component {
  x: number;
  y: number;
};

export interface CharacterMovementComponent extends Component {
  direction: { x: number; y: number };
  speed: number;
  moving: boolean;
  facing: "up" | "down" | "left" | "right";
}
