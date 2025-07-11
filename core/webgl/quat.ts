import { math_cos, math_deg_to_rad, math_sin } from "./math";
import type { Vec3 } from "./vec3";

export interface Quat {
    x: number;
    y: number;
    z: number;
    w: number;
}

export function euler_to_quat(q: Quat, v: Vec3): void {
    const rollRad = math_deg_to_rad(v.x) * 0.5;
    const pitchRad = math_deg_to_rad(v.y) * 0.5;
    const yawRad = math_deg_to_rad(v.z) * 0.5;

    const sinRoll = math_sin(rollRad);
    const cosRoll = math_cos(rollRad);
    const sinPitch = math_sin(pitchRad);
    const cosPitch = math_cos(pitchRad);
    const sinYaw = math_sin(yawRad);
    const cosYaw = math_cos(yawRad);

    const x = cosPitch * sinRoll * cosYaw - cosRoll * sinPitch * sinYaw;
    const y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
    const z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
    const w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;

    q.w = w;
    q.x = x;
    q.y = y;
    q.z = z;
}