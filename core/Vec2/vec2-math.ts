import type { Vec2 } from "./Vec2";

function normalize(v: Vec2): Vec2 {
  const length = Vec2Math.length(v);
  if (length === 0) return { x: 0, y: 0 };
  return Vec2Math.divScalar(v, length);
}

function normalizeInto(v: Vec2, out: Vec2): Vec2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) {
    out.x = 1;
    out.y = 0;
  } else {
    out.x = v.x / len;
    out.y = v.y / len;
  }
  return out;
}
function subtract(
  a: Vec2,
  b: Vec2
): Vec2 {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function add(
  a: Vec2,
  b: Vec2
): Vec2 {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

function perpendicular(v: Vec2): Vec2 {
  return { x: -v.y, y: v.x };
}

function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}


function divScalar(
  a: Vec2,
  scalar: number
): Vec2 {
  return {
    x: a.x / scalar,
    y: a.y / scalar
  };
}

function length(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
function lengthSquared(v: Vec2): number {
  return v.x * v.x + v.y * v.y;
}

function distance(a: Vec2, b: Vec2): number {
  return length(subtract(a, b));
}

function distanceSquared(a: Vec2, b: Vec2): number {
  return lengthSquared(subtract(a, b));
}

function subtractInto(a: Vec2, b: Vec2, out: Vec2): Vec2 {
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
}

function createZero(): Vec2 {
  return {x: 0, y: 0}
}


const Vec2Math = {
  normalize,
  normalizeInto,
  dot,
  perpendicular,
  subtract,
  add,
  subtractInto,
  divScalar,
  length,
  lengthSquared,
  distance,
  createZero,
  distanceSquared
};



export default Vec2Math;
