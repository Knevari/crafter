import type { Vector2 } from "../types/vector2";

function normalize(v: Vector2): Vector2 {
  const length = Vec2.length(v);
  if (length === 0) return { x: 0, y: 0 }; 
  return Vec2.divScalar(v, length);
}

function subtract(
  a: Vector2,
  b: Vector2
): Vector2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function divScalar(
  a: Vector2,
  scalar: number
): Vector2 {
  return {
    x: a.x / scalar,
    y: a.y / scalar
  };
}

function length(v: Vector2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function distance(a: Vector2, b: Vector2): number {
  return length(subtract(a, b));
}

const Vec2 = {
  normalize,
  subtract,
  divScalar,
  length,
  distance
};

export default Vec2;
