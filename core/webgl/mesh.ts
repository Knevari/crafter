import type { Vec2 } from "../Vec2/Vec2";
import type { Vec3 } from "./vec3";

export interface Mesh {
    name: string;
    vertices: Vec3[];
    indices: number[];
    normals: Vec3[];
    uvs: Vec2[];
}

