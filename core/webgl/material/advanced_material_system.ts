import { ComponentType } from "../../../engine/enums";
import { generic_manager_get } from "../../managers/generic_manager";
import { mat4_create_TR, mat4_create_TRS } from "../mat4";
import type { ShaderSystem } from "../system/shader_system";
import type { Vec3 } from "../vec3";
import type { Material } from "./material";
import type { Shader } from "../shader/shader";
import { shader_set_uniform_1f, shader_set_uniform_2f, shader_set_uniform_3f, shader_set_uniform_4f, shader_set_uniform_mat4, shader_set_uniform_texture } from "../shader/shader_uniforms";
import { get_category, get_sprite_render, get_transform } from "../../builders/get_component";
import { matrix_get } from "../../managers/helper";
import { TEXTURE_MANAGER } from "../../managers/texture_manager";
import { ENGINE } from "../../../engine/engine.manager";


function set_props(material: Material, shader: Shader) {

    const props = material.props;
    if(!props) return;

    for (const prop of props) {
        switch (prop.type) {
            case "float":
                shader_set_uniform_1f(shader, prop.name, prop.value);
                break;
            case "int":
                break;
            case "bool":
                break;
            case "vec3":
                shader_set_uniform_3f(shader, prop.name, prop.value.x, prop.value.y, prop.value.z);
                break;
            case "color":
                shader_set_uniform_4f(shader, prop.name, prop.value.r, prop.value.g, prop.value.b, prop.value.a);
                break;
            case "texture":
                break;
            default:
                console.warn(`Unknown material prop type: ${(prop as any).type}`);
        }
    }
}

export function advanced_material_system(material: Material): ShaderSystem {
    const shader = generic_manager_get(ENGINE.MANAGER.SHADER, material.shaderName);
    if (!shader) throw new Error(`Shader ${material.shaderName} not found in SHADER_MANAGER.`);

    let flip_cache: Vec3 = { x: 0, y: 0, z: 0 };

    return {
        global() {
            const cameras = get_category(ComponentType.CAMERA);
            if (cameras.length === 0) return;
            const camera = cameras[0];

            const transform = get_transform(camera.gameEntity);
            if (transform == null) return;

            const viewMatrix = generic_manager_get(ENGINE.MANAGER.MAT4, transform.instance)!;
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

            if (!spriteRender.sprite) return;

            const modelMatrix = matrix_get(transform.instance)!;

            flip_cache.x = spriteRender.flipHorizontal ? -transform.scale.x : transform.scale.x;
            flip_cache.y = spriteRender.flipVertical ? -transform.scale.y : transform.scale.y;
            flip_cache.z = transform.scale.z;

            mat4_create_TRS(
                modelMatrix,
                transform.position,
                transform.rotation,
                flip_cache,

            );

            shader_set_uniform_mat4(shader, "uModel", modelMatrix.value);

            const texture = generic_manager_get(TEXTURE_MANAGER, spriteRender.sprite.textureName)!;
            shader_set_uniform_texture(shader, "uTexture", texture, 0);

            const uvScaleX = spriteRender.sprite.size.x / texture.width;
            const uvScaleY = spriteRender.sprite.size.y / texture.height;
            shader_set_uniform_2f(shader, "uUVScale", uvScaleX, uvScaleY);

            const uvOffsetX = spriteRender.sprite.position.x / texture.width;
            const uvOffsetY = (texture.height - spriteRender.sprite.position.y - spriteRender.sprite.size.y) / texture.height;
            shader_set_uniform_2f(shader, "uUVOffset", uvOffsetX, uvOffsetY);
            set_props(material, shader);

        },

    };
}
