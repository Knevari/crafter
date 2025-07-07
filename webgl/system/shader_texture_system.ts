import { getMouseButton, getMousePosition } from "../../core/gears/input";
import type { CameraComponent } from "../../core/gears/render/camera";
import { ComponentType } from "../../engine/enums";
import { ECS } from "../../engine/TwoD";
import type { TransformComponent } from "../../engine/types";
import { globalMouseState } from "../../game/input/input.system";
import { rgb } from "../../game/systems/procedural-world/biome";
import { generic_manager_get } from "../managers/generic_manager";
import { matrixManager } from "../managers/matrix_manager";
import { shaderManager } from "../managers/shader_manager";
import { textureManager } from "../managers/texture_manager";
import { composeTR, composeTRS, setTranslation, translateMatrix } from "../mat4";
import type { Material } from "../material/material";
import type { TexturedMaterial } from "../material/textured_material";
import {
    shader_set_uniform_1f,
    shader_set_uniform_2f,
    shader_set_uniform_4f,
    shader_set_uniform_mat4,
    shader_set_uniform_texture,
} from "../shader";
import type { Vec3 } from "../vec3";
import type { ShaderSystem } from "./shader_system";

export function MaterialSolidColorSystem(material: Material): ShaderSystem {
    const shader = generic_manager_get(shaderManager, material.shaderName)!;
    return {
        global(gl, camera, componentState) {
            const cameraTransform = ECS.Component.getComponent<
                TransformComponent
            >(componentState, camera, ComponentType.TRANSFORM)!;
            const cameraComponent = ECS.Component.getComponent<CameraComponent>(
                componentState,
                camera,
                ComponentType.CAMERA,
            )!;

            const viewMatrix = generic_manager_get(
                matrixManager,
                cameraTransform.instanceId,
            )!;
            setTranslation(viewMatrix, cameraTransform.position);
            shader_set_uniform_mat4(gl, shader, "uView", viewMatrix.value);

            const projectionMatrix = generic_manager_get(
                matrixManager,
                cameraComponent.instanceId,
            )!;
            shader_set_uniform_mat4(
                gl,
                shader,
                "uProjection",
                projectionMatrix.value,
            );
        },
        local(gl, spriteRender, transform) {
            const modelMatrix = generic_manager_get(
                matrixManager,
                transform.instanceId,
            )!;
            setTranslation(modelMatrix, transform.position);
            shader_set_uniform_mat4(gl, shader, "uModel", modelMatrix.value);

            shader_set_uniform_4f(
                gl,
                shader,
                "uColor",
                spriteRender.color.r,
                spriteRender.color.g,
                spriteRender.color.b,
                spriteRender.color.a,
            );
        },
    };
}

export function MaterialTexturedSystem(material: TexturedMaterial): ShaderSystem {
    const shader = generic_manager_get(shaderManager, material.shaderName)!;

    let flipCache: Vec3 = { x: 0, y: 0, z: 0 };

    return {
        global(gl, camera, componentState) {
            const cameraTransform = ECS.Component.getComponent<TransformComponent>(
                componentState,
                camera,
                ComponentType.TRANSFORM,
            )!;
            const cameraComponent = ECS.Component.getComponent<CameraComponent>(
                componentState,
                camera,
                ComponentType.CAMERA,
            )!;

            const viewMatrix = generic_manager_get(matrixManager, cameraTransform.instanceId)!;
            composeTR(viewMatrix, cameraTransform.position, cameraTransform.rotation);
            shader_set_uniform_mat4(gl, shader, "uView", viewMatrix.value);

            const projectionMatrix = generic_manager_get(matrixManager, cameraComponent.instanceId)!;
            shader_set_uniform_mat4(gl, shader, "uProjection", projectionMatrix.value);
        },

        local(gl, spriteRender, transform) {
            if (!spriteRender.sprite) return;

            const modelMatrix = generic_manager_get(matrixManager, transform.instanceId)!;

            flipCache.x = spriteRender.flipHorizontal ? -transform.scale.x : transform.scale.x;
            flipCache.y = spriteRender.flipVertical ? -transform.scale.y : transform.scale.y;
            flipCache.z = transform.scale.z;

           
            composeTRS(modelMatrix, transform.position, transform.rotation, flipCache);

            shader_set_uniform_mat4(gl, shader, "uModel", modelMatrix.value);

            const texture = generic_manager_get(textureManager, spriteRender.sprite.textureName)!;
            shader_set_uniform_texture(gl, shader, "uTexture", texture, 0);

            const uvScaleX = spriteRender.sprite.size.x / texture.width;
            const uvScaleY = spriteRender.sprite.size.y / texture.height;
            shader_set_uniform_2f(gl, shader, "uUVScale", uvScaleX, uvScaleY);

            const uvOffsetX = spriteRender.sprite.position.x / texture.width;
            const uvOffsetY = (texture.height - spriteRender.sprite.position.y - spriteRender.sprite.size.y) / texture.height;


            shader_set_uniform_2f(gl, shader, "uUVOffset", uvOffsetX, uvOffsetY);

            shader_set_uniform_4f(
                gl,
                shader,
                "uColor",
                spriteRender.color.r,
                spriteRender.color.g,
                spriteRender.color.b,
                spriteRender.color.a,
            );
        },

    };
}

export function MaterialWater2DNoTextureSystem(material: Material): ShaderSystem {
    const shader = generic_manager_get(shaderManager, material.shaderName)!;

    return {
        global(gl, camera, componentState) {
            const cameraTransform = ECS.Component.getComponent<TransformComponent>(
                componentState,
                camera,
                ComponentType.TRANSFORM,
            )!;
            const cameraComponent = ECS.Component.getComponent<CameraComponent>(
                componentState,
                camera,
                ComponentType.CAMERA,
            )!;

            const viewMatrix = generic_manager_get(matrixManager, cameraTransform.instanceId)!;
            setTranslation(viewMatrix, cameraTransform.position);
            shader_set_uniform_mat4(gl, shader, "uView", viewMatrix.value);

            const projectionMatrix = generic_manager_get(matrixManager, cameraComponent.instanceId)!;
            shader_set_uniform_mat4(gl, shader, "uProjection", projectionMatrix.value);


            shader_set_uniform_1f(gl, shader, "uTime", performance.now() / 2000);
        },

        local(gl, spriteRender, transform) {
            const modelMatrix = generic_manager_get(matrixManager, transform.instanceId)!;
            setTranslation(modelMatrix, transform.position);
            shader_set_uniform_mat4(gl, shader, "uModel", modelMatrix.value);



            spriteRender.color = rgb(1, 161, 253);
            // Setar a cor
            shader_set_uniform_4f(
                gl,
                shader,
                "uColor",
                spriteRender.color.r,
                spriteRender.color.g,
                spriteRender.color.b,
                spriteRender.color.a,
            );

            const pos = getMousePosition(globalMouseState);
            const width = gl.canvas.width;
            const height = gl.canvas.height;

            const mouseX = pos.x / width;
            const mouseY = 1.0 - (pos.y / height);

            shader_set_uniform_2f(gl, shader, "uMouse", mouseX, mouseY);


            shader_set_uniform_1f(gl, shader, "uMouseDown", getMouseButton(globalMouseState, 0) ? 1 : 0)

            // NÃO MULTIPLICAR pelo waveScale aqui
            shader_set_uniform_2f(gl, shader, "uTileSize", transform.scale.x, transform.scale.y);
            shader_set_uniform_2f(gl, shader, "uWorldOffset", transform.position.x, transform.position.y);

            // Envie waveScale separadamente
            shader_set_uniform_1f(gl, shader, "uWaveScale", 1);

        },
    };
}
