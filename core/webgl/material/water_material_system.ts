import { ENGINE } from "../../../engine/engine.manager";
import { rgb } from "../../../game/systems/procedural-world/biome";
import { get_category, get_sprite_render, get_transform } from "../../builders/get_component";
import { generic_manager_get } from "../../managers/generic_manager";
import { ComponentType } from "../../types/component-type";
import { mat4_create_TR, mat4_create_TRS } from "../mat4";
import { shader_set_uniform_mat4, shader_set_uniform_1f, shader_set_uniform_2f, shader_set_uniform_4f } from "../shader";
import type { ShaderSystem } from "../system/shader_system";
import type { Material } from "./material";

export function water_material_system(material: Material): ShaderSystem {
    const shader = generic_manager_get(ENGINE.MANAGER.SHADER, material.shaderName)!;

    return {
        global() {

            const cameras = get_category(ComponentType.CAMERA);
            if (cameras.length === 0) return;
            const camera = cameras[0];

            const cameraTransform = get_transform(camera.gameEntity);
            if (cameraTransform == null) return;

            const viewMatrix = generic_manager_get(ENGINE.MANAGER.MAT4, cameraTransform.instance)!;
            mat4_create_TR(viewMatrix, cameraTransform.position, cameraTransform.rotation);
            shader_set_uniform_mat4(shader, "uView", viewMatrix.value);

            const projectionMatrix = generic_manager_get(ENGINE.MANAGER.MAT4, camera.instance)!;
            shader_set_uniform_mat4(shader, "uProjection", projectionMatrix.value);

            shader_set_uniform_1f(shader, "uTime", performance.now() / 2000);
        },

        local(gameEntity) {

            const transform = get_transform(gameEntity);
            if (transform == null) return;

            const spriteRender = get_sprite_render(gameEntity);
            if (spriteRender == null) return;

            const modelMatrix = generic_manager_get(ENGINE.MANAGER.MAT4, transform.instance)!;
            mat4_create_TRS(modelMatrix, transform.position, transform.rotation, transform.scale);
            shader_set_uniform_mat4(shader, "uModel", modelMatrix.value);

            spriteRender.color = rgb(1, 161, 253);

            shader_set_uniform_4f(
                shader,
                "uColor",
                spriteRender.color.r,
                spriteRender.color.g,
                spriteRender.color.b,
                spriteRender.color.a,
            );

            shader_set_uniform_2f(shader, "uTileSize", transform.scale.x, transform.scale.y);
            shader_set_uniform_2f(shader, "uWorldOffset", transform.position.x, transform.position.y);

            shader_set_uniform_1f(shader, "uWaveScale", 1);
        },
    };
}