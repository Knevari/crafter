import { type ImageFile, type TextFile, resourceManager } from "../core/managers/resources-manager";
import { ECS } from "../engine/TwoD";
import { createShader } from "../core/webgl/shader/shader";
import { generic_manager_add, generic_manager_get } from "../core/managers/generic_manager";
import { createCamera } from "./entities/camera.entity";
import { createPlayer } from "./entities/player.entity";
import type { Material } from "../core/webgl/material/material";
import { SYSTEM_STATE } from "../core/gears/ecs/system";
import { SpriteRenderSystem } from "../core/gears/render/sprite_render";
import CharacterControlerSystem from "./systems/character-controller/character-controller-system";
import { MESH_MANAGER } from "../core/managers/mesh_manager";
import { createMeshVAO } from "../core/webgl/mesh_gl";
import { VAO_MANAGER } from "../core/managers/vao_manager";
import { TEXTURE_MANAGER } from "../core/managers/texture_manager";
import { createTexture } from "../core/webgl/texture";
import { AnimatorSystem } from "../core/gears/animator";
import CharacterControllerAnimationSystem from "./systems/character-controller/character-controller-animations";
import { QUAD_MESH } from "../core/webgl/geometry/square";
import { TerrainSystem } from "./systems/procedural-world/terrain-system";
import { CameraSystem } from "./systems/camera_system";
import type { CameraComponent } from "../core/gears/render/camera";
import { ComponentType } from "../engine/enums";
import { mat4_create_projection } from "../core/webgl/mat4";
import { SHADER_SYSTEM_MANAGER } from "../core/managers/shader_system_manager";
import { ColliderSystem } from "../core/gears/collider/collider.system";
import { PhysicsSystem } from "../core/gears/collider/physics_system";
import { simple_material_system } from "../core/webgl/material/simple_material_system";
import { advanced_material_system } from "../core/webgl/material/advanced_material_system";
import { water_material_system } from "../core/webgl/material/water_material_system";
import { createSlime } from "./entities/slime.entity";
import { rgba } from "./systems/procedural-world/biome";
import { shader_inject_context } from "../core/webgl/shader/shader_uniforms";
import { ENGINE } from "../engine/engine.manager";
import { MANAGER } from "../core/managers/entity_manager";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl2', { depth: true, antialias: true, desynchronized: true, alpha: true })!;

if (!gl) throw new Error("WebGL not supported");

shader_inject_context(gl);


function shader_create_and_link(name: string, vertName: string, fragName: string) {
    const vertSrcColor = resourceManager.getTextFileSafe(vertName);
    const fragSrcColor = resourceManager.getTextFileSafe(fragName);

    if (!vertSrcColor.ok) {
        console.warn("Erro ao carregar o shader padrao de cor");
        return;
    }

    if (!fragSrcColor.ok) {
        console.warn("Erro ao carregar o shader padrao de cor");
        return;
    }

    const shader = createShader(gl, name, vertSrcColor.value, fragSrcColor.value);
    generic_manager_add(ENGINE.MANAGER.SHADER, shader.name, shader);
}

function material_create_and_link(name: string, shader: string) {

    const material: Material = {
        name: name,
        shaderName: shader,
        props: [
            { name: "uColor", type: "color", value: rgba(255, 255, 255, 1) }
        ]
    };

    generic_manager_add(ENGINE.MANAGER.MATERIAL, material.name, material);
}







async function LoadResources() {

    const images: ImageFile[] = [
        {
            name: "spider_man",
            path: "./assets/images/spider-man.png"
        },
        {
            name: "background",
            path: "./assets/images/background.png"
        },
        { name: "player", path: "./assets/images/Player.png" },
        { name: "slime", path: "./assets/images/Slime.png" },
        { name: "oak_tree", path: "assets/images/OakTree.png" },
        { name: "bushe", path: "assets/images/Bushes.png" },

    ];

    await resourceManager.loadImageFiles(images);
    for (const [key, val] of resourceManager.images) {

        const imageBitmap = await createImageBitmap(val, {
            imageOrientation: "flipY"
        });

        const texture = createTexture(gl, imageBitmap);
        generic_manager_add(TEXTURE_MANAGER, key, texture);
    }

    const texts: TextFile[] = [
        { name: "vert_shader_texture", path: "../core/shader/shader_texture.vert" },
        { name: "frag_shader_texture", path: "../core/shader/shader_texture.frag" },
        { name: "vert_shader_color", path: "../core/shader/shader_color.vert" },
        { name: "frag_shader_color", path: "../core/shader/shader_color.frag" },
        { name: "music_shader_frag", path: "../core/shader/music_shader.frag" },
        { name: "music_shader_vert", path: "../core/shader/music_shader.vert" },
        { name: "frag_shader_water_no_texture", path: "../core/shader/frag_shader_water_no_texture.frag" }
    ]

    await resourceManager.loadTextFiles(texts);


    shader_create_and_link("simple_shader", "vert_shader_color", "frag_shader_color");
    shader_create_and_link("advanced_shader", "vert_shader_texture", "frag_shader_texture");
    shader_create_and_link("water_shader", "vert_shader_color", "frag_shader_water_no_texture");

    // ----------------------------------------------------------------
    material_create_and_link("simple_material", "simple_shader");
    material_create_and_link("advanced_material", "advanced_shader")

    const simple_shader_color_system = simple_material_system("simple_shader");
    generic_manager_add(SHADER_SYSTEM_MANAGER, "simple_material", simple_shader_color_system);

    // ----------------------------------------------------------------


    const advanced_material: Material = {
        name: "advanced_material",
        shaderName: "advanced_shader",

        props: [
            { name: "uColor", type: "color", value: rgba(255, 255, 255, 1) }
        ]
    };

    generic_manager_add(ENGINE.MANAGER.MATERIAL, advanced_material.name, advanced_material);
    const advanced_shader_color_system = advanced_material_system(advanced_material);
    generic_manager_add(SHADER_SYSTEM_MANAGER, advanced_material.name, advanced_shader_color_system);


    const water_material: Material = {
        name: "water_material",
        shaderName: "water_shader",

    };

    const simple_shader_water_system = water_material_system(water_material);
    generic_manager_add(SHADER_SYSTEM_MANAGER, water_material.name, simple_shader_water_system);
    generic_manager_add(ENGINE.MANAGER.MATERIAL, water_material.name, water_material);










    generic_manager_add(MESH_MANAGER, QUAD_MESH.name, QUAD_MESH);
    const square_vao = createMeshVAO(gl, QUAD_MESH);
    generic_manager_add(VAO_MANAGER, QUAD_MESH.name, square_vao);




}

await LoadResources();
export async function GameMain() {

    const componentState = ENGINE.DEFAULT_COMPONENT_STATE;
    const player = createPlayer(componentState, "player");

    const camera = createCamera(componentState);
    const slime = createSlime(componentState, "slime");

    ECS.System.addSystem(SYSTEM_STATE, SpriteRenderSystem(gl, componentState));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControlerSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControllerAnimationSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, AnimatorSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, TerrainSystem(componentState, player));
    ECS.System.addSystem(SYSTEM_STATE, CameraSystem(componentState, camera, player));
    ECS.System.addSystem(SYSTEM_STATE, ColliderSystem(componentState, SYSTEM_STATE));
    ECS.System.addSystem(SYSTEM_STATE, PhysicsSystem(componentState));

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const cam = ECS.Component.getComponent<CameraComponent>(componentState, camera, ComponentType.CAMERA);

        if (cam) {
            cam.aspec = canvas.width / canvas.height;
            const matrix = generic_manager_get(MANAGER.MAT4, cam.instance);
            if (!matrix) return;
            mat4_create_projection(matrix, cam.fov, cam.aspec, cam.near, cam.far);

        }
        gl.viewport(0, 0, canvas.width, canvas.height);
    });
}