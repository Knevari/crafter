import type { Mesh } from "./mesh";
import { vec3Tof32Arr } from "./vec3";
import { vec2Tof32Arr } from "../core/Vec2/Vec2";

export interface MeshGL {
    vao: WebGLVertexArrayObject;
    vbo: WebGLBuffer;
    ebo: WebGLBuffer;
    uvBuffer: WebGLBuffer;
    indexCount: number;
}

export function createMeshVAO(gl: WebGL2RenderingContext, mesh: Mesh): MeshGL {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);


    const positions = vec3Tof32Arr(mesh.vertices);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); 
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

  
    const uvs = vec2Tof32Arr(mesh.uvs);
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1); 
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

  
    const indices = new Uint16Array(mesh.indices);
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return {
        vao,
        vbo,
        uvBuffer,
        ebo,
        indexCount: mesh.indices.length,
    };
}
