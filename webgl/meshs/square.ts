import type { Mesh } from "../mesh";
import type { Vec3 } from "../vec3";

function create_quad_mesh(name: string, size: Vec3): Mesh {
    const halfSize = {
        x: size.x * 0.5,
        y: size.y * 0.5,
        z: size.z * 0.5,
    };

    return {
        name: name,
        vertices: [
            { x: -halfSize.x, y: -halfSize.y, z: 0 },
            { x: halfSize.x, y: -halfSize.y, z: 0 },
            { x: halfSize.x, y: halfSize.y, z: 0 },
            { x: -halfSize.x, y: halfSize.y, z: 0 },
        ],
        indices: [
            0, 1, 2,
            2, 3, 0,
        ],
        normals: [
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: 1 },
        ],
        uvs: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
        ],
    };
}

export const UNIT_QUAD_MESH = create_quad_mesh("quad_mesh", { x: 1, y: 1, z: 0 });
