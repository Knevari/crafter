// import { rgba } from "../../../game/systems/procedural-world/biome";
// import { generic_manager_add, generic_manager_get } from "../../managers/generic_manager";
// import { MATERIAL_MANAGER } from "../../managers/material_manager";
// import { MESH_MANAGER } from "../../managers/mesh_manager";
// import { SHADER_MANAGER } from "../../managers/shader_manager";
// import { VAO_MANAGER } from "../../managers/vao_manager";
// import { createIdentity, mat4_compose_trs, type Mat4 } from "../../webgl/mat4";
// import type { Material } from "../../webgl/material/material";
// import { createInstancedMeshVAO } from "../../webgl/mesh_gl";
// import { create_quad_mesh } from "../../webgl/meshs/square";
// import type { Quat } from "../../webgl/quat";
// import { shader_set_uniform_mat4, shader_set_uniform_4f } from "../../webgl/shader/shader";
// import type { Vec3 } from "../../webgl/vec3";

// interface GizmosTransform {
//     position: Vec3;
//     rotation: Quat;
//     scale: Vec3;
// }

// const gizmosTransform: GizmosTransform[] = [];

// function GizmosSystem(gl: WebGL2RenderingContext) {
    
//     const gizmos_quad_mesh = create_quad_mesh("gizmos_quad_mesh", { x: 1, y: 1, z: 0 });
//     generic_manager_add(MESH_MANAGER, gizmos_quad_mesh.name, gizmos_quad_mesh);

//     const square_gizmos_vao = createInstancedMeshVAO(gl, gizmos_quad_mesh);
//     generic_manager_add(VAO_MANAGER, gizmos_quad_mesh.name, square_gizmos_vao);

//     const gizmos_material: Material = {
//         color: rgba(255, 255, 255, 1),
//         name: "gizmos_material",
//         shaderName: "gizmos_shader"
//     }

//     generic_manager_add(MATERIAL_MANAGER, gizmos_material.name, gizmos_material);
// }



// function draw_wire_square(position: Vec3, rotation: Quat, scale: Vec3) {
//     gizmosTransform.push({
//         position: position,
//         rotation: rotation,
//         scale: scale
//     })
// }

// const identity = createIdentity();

// export function gizmos_draw_gizmos(gl: WebGL2RenderingContext, viewMatrix: Mat4, projectionMatrix: Mat4) {
//     const vao = generic_manager_get(VAO_MANAGER, "wire_square_instanced");
//     if (!vao) return;

//     const shader = generic_manager_get(SHADER_MANAGER, "gizmos_shader");
//     if (!shader) return;

//     const instanceCount = gizmosTransform.length;
//     if (instanceCount === 0) return;

//     const matrixData = new Float32Array(instanceCount * 16);
//     for (let i = 0; i < instanceCount; i++) {
//         const gizmo = gizmosTransform[i];
//         mat4_compose_trs(identity, gizmo.position, gizmo.rotation, gizmo.scale);
//         matrixData.set(identity.value, i * 16);
//     }

//     gl.bindVertexArray(vao.vao);
//     gl.bindBuffer(gl.ARRAY_BUFFER, vao.modelMatrixBuffer);
//     gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

//     gl.useProgram(shader.program);

//     shader_set_uniform_mat4(gl, shader, "uView", viewMatrix.value);
//     shader_set_uniform_mat4(gl, shader, "uProjection", projectionMatrix.value);
//     shader_set_uniform_4f(gl, shader, "uColor", 1, 1, 1, 1);

//     gl.enable(gl.BLEND);
//     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//     gl.drawElementsInstanced(
//         gl.LINES,
//         vao.indexCount,
//         gl.UNSIGNED_SHORT,
//         0,
//         instanceCount
//     );

//     gl.bindVertexArray(null);
//     gizmosTransform.length = 0;
// }
