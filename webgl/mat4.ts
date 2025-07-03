import { type Vec3 } from "./vec3";

export interface Mat4 {
    value: Float32Array;
}

export interface Quat {
    x: number;
    y: number;
    z: number;
    w: number;
}

export function createMat4(
    m00: number = 1.0, m10: number = 0.0, m20: number = 0.0, m30: number = 0.0,
    m01: number = 0.0, m11: number = 1.0, m21: number = 0.0, m31: number = 0.0,
    m02: number = 0.0, m12: number = 0.0, m22: number = 1.0, m32: number = 0.0,
    m03: number = 0.0, m13: number = 0.0, m23: number = 0.0, m33: number = 1.0) {

    const mat4: Mat4 = { value: new Float32Array(16) };

    mat4.value.set([
        m00, m10, m20, m30,
        m01, m11, m21, m31,
        m02, m12, m22, m32,
        m03, m13, m23, m33
    ]);

    return mat4;
}


export function createIdentity() {

    const mat4: Mat4 = { value: new Float32Array(16) };

    mat4.value.set([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    return mat4;
}


export function translateMatrix(m: Mat4, t: Vec3) {
    const e = m.value;

    e[12] = e[0] * t.x + e[4] * t.y + e[8] * t.z + e[12];
    e[13] = e[1] * t.x + e[5] * t.y + e[9] * t.z + e[13];
    e[14] = e[2] * t.x + e[6] * t.y + e[10] * t.z + e[14];
    e[15] = e[3] * t.x + e[7] * t.y + e[11] * t.z + e[15];
}

export function setTranslation(m: Mat4, t: Vec3) {
    const e = m.value;

    e[12] = t.x;
    e[13] = t.y;
    e[14] = t.z;
    e[15] = 1;
}


export function rotateMatrix(m: Mat4, r: Quat) {
    const x = r.x, y = r.y, z = r.z, w = r.w;

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const yy = y * y2;
    const zz = z * z2;
    const xy = x * y2;
    const yz = y * z2;
    const zx = z * x2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;

    const rot = new Float32Array([
        1 - yy - zz, xy + wz,     zx - wy,     0,
        xy - wz,     1 - xx - zz, yz + wx,     0,
        zx + wy,     yz - wx,     1 - xx - yy, 0,
        0,           0,           0,           1
    ]);

    multiplyMat4(m, { value: rot });
}

export function scaleMatrix(m: Mat4, s: Vec3) {
    const e = m.value;

    e[0] *= s.x; e[4] *= s.y; e[8]  *= s.z;
    e[1] *= s.x; e[5] *= s.y; e[9]  *= s.z;
    e[2] *= s.x; e[6] *= s.y; e[10] *= s.z;
    e[3] *= s.x; e[7] *= s.y; e[11] *= s.z;
}

export function multiplyMat4(m1: Mat4, m2: Mat4) {
    const a = m1.value;
    const b = m2.value;

    const result = new Float32Array(16);

    for (let i = 0; i < 4; ++i) {  
        for (let j = 0; j < 4; ++j) {  
            result[i * 4 + j] =
                a[0 * 4 + j] * b[i * 4 + 0] +
                a[1 * 4 + j] * b[i * 4 + 1] +
                a[2 * 4 + j] * b[i * 4 + 2] +
                a[3 * 4 + j] * b[i * 4 + 3];
        }
    }

    m1.value.set(result);
}

export function updateProjectionMatrix(m: Mat4, fovY: number, aspect: number, near: number, far: number) {
    const fovRadians = (fovY * Math.PI) / 180;
    const f = 1.0 / Math.tan(fovRadians / 2);
    const nf = 1 / (near - far);

    const e = m.value;
    e[0] = f / aspect;
    e[5] = f;
    e[10] = (far + near) * nf;
    e[11] = -1;
    e[14] = (2 * far * near) * nf;
    e[15] = 0;
}
