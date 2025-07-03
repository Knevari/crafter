export interface Vec2 {
  x: number;
  y: number;
}

export function vec2Tof32Arr(vectors: Vec2[], out?: Float32Array): Float32Array {
  if (!out || out.length < vectors.length * 2) {
    out = new Float32Array(vectors.length * 2);
  }
  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i];
    out[i * 2] = v.x;
    out[i * 2 + 1] = v.y;
  }
  return out;
}