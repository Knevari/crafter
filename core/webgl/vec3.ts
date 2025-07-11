export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export function vec3_lerp(out: Vec3, a: Vec3, b: Vec3, t: number): Vec3 {
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    out.z = a.z + (b.z - a.z) * t;
    return out;
}


export function subVec3(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scaleVec3(a: Vec3, scalar: number): Vec3 {
    return { x: a.x * scalar, y: a.y * scalar, z: a.z * scalar };
}

export function crossVec3(a: Vec3, b: Vec3): Vec3 {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

export function dotVec3(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function normalizeVec3(v: Vec3): Vec3 {
    const length = Math.hypot(v.x, v.y, v.z);
    return length > 0 ? { x: v.x / length, y: v.y / length, z: v.z / length } : { x: 0, y: 0, z: 0 };
}

export function vec3Tof32Arr(vectors: Vec3[], out?: Float32Array): Float32Array {
    if (!out || out.length < vectors.length * 3) {
        out = new Float32Array(vectors.length * 3);
    }
    for (let i = 0; i < vectors.length; i++) {
        const v = vectors[i];
        out[i * 3] = v.x;
        out[i * 3 + 1] = v.y;
        out[i * 3 + 2] = v.z;
    }
    return out;
}

