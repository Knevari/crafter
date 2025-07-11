import { ComponentType } from "../../../engine/enums";
import { generic_manager_get } from "../../managers/generic_manager";
import { mat4_create_TR, mat4_create_TRS } from "../mat4";
import type { ShaderSystem } from "../system/shader_system";
import { shader_set_uniform_mat4, shader_set_uniform_4f } from "../shader";
import { get_category, get_sprite_render, get_transform } from "../../builders/get_component";
import { ENGINE } from "../../../engine/engine.manager";

export function simple_material_system(shaderName: string): ShaderSystem {
    const shader = generic_manager_get(ENGINE.MANAGER.SHADER, shaderName)!;

    return {

        global() {

            const cameras = get_category(ComponentType.CAMERA);
            if(cameras.length === 0) return;
            const camera = cameras[0];

            const transform = get_transform(camera.gameEntity);
            if (transform == null) return;

            const viewMatrix = generic_manager_get( ENGINE.MANAGER.MAT4,transform.instance )!;
            mat4_create_TR(viewMatrix, transform.position, transform.rotation);
            shader_set_uniform_mat4(shader, "uView", viewMatrix.value);

            const projectionMatrix = generic_manager_get(ENGINE.MANAGER.MAT4, camera.instance)!;
            shader_set_uniform_mat4(shader, "uProjection", projectionMatrix.value);

        },
        
        local(gameEntity) {

            const transform = get_transform(gameEntity);
            if (!transform) return;

            const spriteRender = get_sprite_render(gameEntity);
            if (!spriteRender) return;

            const modelMatrix = generic_manager_get(
                ENGINE.MANAGER.MAT4,
                transform.instance,
            )!;
            mat4_create_TRS(modelMatrix, transform.position, transform.rotation, transform.scale);
            shader_set_uniform_mat4(shader, "uModel", modelMatrix.value);

            shader_set_uniform_4f(

                shader,
                "uColor",
                spriteRender.color.r,
                spriteRender.color.g,
                spriteRender.color.b,
                spriteRender.color.a,
            );
        }
    };
}