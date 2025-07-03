import { type ImageFile, type TextFile, resourceManager } from "../core/managers/resources-manager";
import { ECS } from "../engine/TwoD";
import { shaderManager } from "../webgl/managers/shader_manager";
import { createShaderProgram } from "../webgl/shader";
import { generic_manager_add, generic_manager_get } from "../webgl/managers/generic_manager";
import { createCamera } from "./entities/camera.entity";
import { createPlayer, createTest } from "./entities/player.entity";
import { createSlime } from "./entities/slime.entity";
import type { Material, TexturedMaterial } from "../webgl/material";
import { materialManager as MATERIAL_MANAGER } from "../webgl/managers/material_manager";
import { SYSTEM_STATE } from "../core/gears/ecs/system";
import { SpriteRenderSystem } from "../core/gears/render/sprite_render";
import CharacterControlerSystem from "./systems/character-controller/character-controller-system";
import { meshManager } from "../webgl/managers/mesh_manager";
import { createMeshVAO } from "../webgl/mesh_gl";
import { vaoManager } from "../webgl/managers/vao_manager";
import { textureManager } from "../webgl/managers/texture_manager";
import { createTexture } from "../webgl/texture";
import { AnimatorSystem } from "../core/gears/animator";
import CharacterControllerAnimationSystem from "./systems/character-controller/character-controller-animations";
import { UNIT_QUAD_MESH } from "../webgl/meshs/square";
import { TerrainSystem } from "./systems/procedural-world/terrain-system";
import { CameraSystem } from "./systems/camera_system";
import type { CameraComponent } from "../core/gears/render/camera";
import { ComponentType } from "../engine/enums";
import { matrixManager } from "../webgl/managers/matrix_manager";
import { updateProjectionMatrix } from "../webgl/mat4";
import { shaderSystemManager as SHADER_SYSTEM_MANAGER } from "../webgl/managers/shader_system_manager";
import { MaterialSolidColorSystem as SimpleShaderColorSystem, MaterialTexturedSystem, MaterialWater2DNoTextureSystem, MaterialSolidColorSystem } from "../webgl/system/shader_texture_system";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl2')!;

if (!gl) throw new Error("WebGL not supported");



async function LoadResources() {

    const images: ImageFile[] = [
        { name: "player", path: "./assets/textures/Player.png" },
        { name: "slime", path: "./assets/textures/Slime.png" },
        { name: "oak_tree", path: "assets/textures/OakTree.png" },
        { name: "bushe", path: "assets/textures/Bushes.png" },

    ];

    await resourceManager.loadImageFiles(images);
    for (const [key, val] of resourceManager.images) {

        const imageBitmap = await createImageBitmap(val, {
            imageOrientation: "flipY"
        });

        const texture = createTexture(gl, imageBitmap);
        generic_manager_add(textureManager, key, texture);
    }

    const texts: TextFile[] = [
        { name: "vert_shader_texture", path: "../webgl/shader/shader_texture.vert" },
        { name: "frag_shader_texture", path: "../webgl/shader/shader_texture.frag" },
        { name: "vert_shader_color", path: "../webgl/shader/shader_color.vert" },
        { name: "frag_shader_color", path: "../webgl/shader/shader_color.frag" },
        { name: "frag_shader_water_no_texture", path: "../webgl/shader/frag_shader_water_no_texture.frag" }
    ]

    await resourceManager.loadTextFiles(texts);


    const vertSrcColor = resourceManager.getTextFileSafe("vert_shader_color");
    const fragSrcColor = resourceManager.getTextFileSafe("frag_shader_color");
    if (!vertSrcColor.ok || !fragSrcColor.ok) throw new Error();
    const shaderColor = createShaderProgram(gl, "shader_color", vertSrcColor.value, fragSrcColor.value);
    generic_manager_add(shaderManager, shaderColor.name, shaderColor);

    // ----------------------------------------------------------------




    const simple_material: Material = {
        name: "simple_material",
        shaderName: "shader_color",
        color: { r: 1, g: 1, b: 1, a: 1 }
    };

    generic_manager_add(MATERIAL_MANAGER, simple_material.name, simple_material);

    const simple_shader_color_system = MaterialSolidColorSystem(simple_material);
    generic_manager_add(SHADER_SYSTEM_MANAGER, simple_material.name, simple_shader_color_system);

    // ----------------------------------------------------------------

    const vertSrcTexture = resourceManager.getTextFileSafe("vert_shader_texture");
    const fragSrcTexture = resourceManager.getTextFileSafe("frag_shader_texture");
    if (!vertSrcTexture.ok || !fragSrcTexture.ok) throw new Error();
    const shaderTexture = createShaderProgram(gl, "advanced_shader", vertSrcTexture.value, fragSrcTexture.value);
    generic_manager_add(shaderManager, shaderTexture.name, shaderTexture);

    const advanced_material: TexturedMaterial = {
        name: "advanced_material",
        shaderName: "advanced_shader",
        textureName: "",
        color: { r: 1, g: 1, b: 1, a: 1 }
    };

    generic_manager_add(MATERIAL_MANAGER, advanced_material.name, advanced_material);
    const advanced_shader_color_system = MaterialTexturedSystem(advanced_material);
    generic_manager_add(SHADER_SYSTEM_MANAGER, advanced_material.name, advanced_shader_color_system);


    generic_manager_add(meshManager, UNIT_QUAD_MESH.name, UNIT_QUAD_MESH);
    const squareVAO = createMeshVAO(gl, UNIT_QUAD_MESH);
    generic_manager_add(vaoManager, UNIT_QUAD_MESH.name, squareVAO);



    //--------------------------------------------------------------------------------

    const vertSrc = resourceManager.getTextFileSafe("vert_shader_color");
    const fragSrc = resourceManager.getTextFileSafe("frag_shader_water_no_texture");
    if (!vertSrc.ok || !fragSrc.ok) throw new Error();
    const shaderWater = createShaderProgram(gl, "water_shader", vertSrc.value, fragSrc.value);
    generic_manager_add(shaderManager, shaderWater.name, shaderWater);

    const water_material: Material = {
        name: "water_material",
        shaderName: "water_shader",
        color: { r: 1, g: 1, b: 1, a: 1 }
    };

    const simple_shader_water_system = MaterialWater2DNoTextureSystem(water_material);
    generic_manager_add(SHADER_SYSTEM_MANAGER, water_material.name, simple_shader_water_system);

    generic_manager_add(MATERIAL_MANAGER, water_material.name, water_material);
 

}

await LoadResources();

export async function GameMain() {

    const componentState = ECS.Component.createState();
    const player = createPlayer(componentState, "player");

    createTest(componentState, "a")
    const camera = createCamera(componentState);
    const slime = createSlime(componentState, "slime");

    ECS.System.addSystem(SYSTEM_STATE, SpriteRenderSystem(gl, componentState, camera));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControlerSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControllerAnimationSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, AnimatorSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, TerrainSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CameraSystem(componentState, camera, player));

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const cam = ECS.Component.getComponent<CameraComponent>(componentState, camera, ComponentType.CAMERA);

        if (cam) {
            cam.aspec = canvas.width / canvas.height;
            const matrix = generic_manager_get(matrixManager, cam.instanceId);
            if (!matrix) return;
            updateProjectionMatrix(matrix, cam.fov, cam.aspec, cam.near, cam.far);

        }
        gl.viewport(0, 0, canvas.width, canvas.height);
    });

}





