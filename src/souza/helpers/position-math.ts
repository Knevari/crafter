import type { PositionComponent } from "../types/component-position";

function normalize(v: PositionComponent): PositionComponent {
  const length = PositionMath.length(v);
  if (length === 0) return { x: 0, y: 0 }; 
  return PositionMath.divScalar(v, length);
}

function subtract(
  a: PositionComponent,
  b: PositionComponent
): PositionComponent {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function divScalar(
  a: PositionComponent,
  scalar: number
): PositionComponent {
  return {
    x: a.x / scalar,
    y: a.y / scalar
  };
}

function length(v: PositionComponent): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function distance(a: PositionComponent, b: PositionComponent): number {
  return length(subtract(a, b));
}

const PositionMath = {
  normalize,
  subtract,
  divScalar,
  length,
  distance
};

export default PositionMath;
