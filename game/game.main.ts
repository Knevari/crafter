import { type ImageFile, type TextFile, resourceManager } from "../core/managers/resources-manager";
import { ECS } from "../engine/TwoD";
import { shaderManager as SHADER_MANAGER, shaderManager } from "../webgl/managers/shader_manager";
import { createShaderProgram, shader_set_uniform_1f, shader_set_uniform_3f, shader_set_uniform_4f, shader_set_uniform_mat4 } from "../webgl/shader";
import { generic_manager_add, generic_manager_get } from "../webgl/managers/generic_manager";
import { createCamera } from "./entities/camera.entity";
import { createPlayer } from "./entities/player.entity";
import { createSlime } from "./entities/slime.entity";
import type { Material } from "../webgl/material/material";
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
import { setTranslation, updateProjectionMatrix } from "../webgl/mat4";
import { shaderSystemManager as SHADER_SYSTEM_MANAGER } from "../webgl/managers/shader_system_manager";
import { MaterialSolidColorSystem as SimpleShaderColorSystem, MaterialTexturedSystem, MaterialWater2DNoTextureSystem, MaterialSolidColorSystem } from "../webgl/system/shader_texture_system";
import { DepthSortingSystem } from "../core/gears/render/depth_sorting/deepth.sorting.system";
import type { GameEntity } from "../core/types/EngineEntity";
import { createGameEntity, createIncrementalId } from "../engine/builders";
import type { TexturedMaterial } from "../webgl/material/textured_material";
import type { TransformComponent } from "../engine/types";
import type { ShaderSystem } from "../webgl/system/shader_system";
import { ColliderSystem } from "../core/gears/collider/collider.system";
import { PhysicsSystem } from "../core/gears/collider/physics_system";

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
        { name: "music_shader_frag", path: "../webgl/shader/music_shader.frag" },
        { name: "music_shader_vert", path: "../webgl/shader/music_shader.vert" },
        { name: "frag_shader_water_no_texture", path: "../webgl/shader/frag_shader_water_no_texture.frag" }
    ]

    await resourceManager.loadTextFiles(texts);


    const vertSrcColor = resourceManager.getTextFileSafe("vert_shader_color");
    const fragSrcColor = resourceManager.getTextFileSafe("frag_shader_color");
    if (!vertSrcColor.ok || !fragSrcColor.ok) throw new Error();
    const shaderColor = createShaderProgram(gl, "shader_color", vertSrcColor.value, fragSrcColor.value);
    generic_manager_add(SHADER_MANAGER, shaderColor.name, shaderColor);

    // ----------------------------------------------------------------





    // shader e material da musica-------------------------------------------------------

    //     const music_shader_frag = resourceManager.getTextFileSafe("music_shader_frag");
    //     if (!music_shader_frag.ok) throw new Error("Erro ao carregar o frag shader da musica");

    //     const music_shader_vert = resourceManager.getTextFileSafe("music_shader_vert");
    //     if (!music_shader_vert.ok) throw new Error("Erro ao carregar o vert shader da musica");


    //     // Criação programática do elemento de áudio
    //     const audioElement = new Audio();
    //     audioElement.src = "assets/audio/MUSICA ELETRONICA COM GRAVE.mp3";
    //     audioElement.loop = true;
    //     audioElement.preload = "auto";
    //     audioElement.crossOrigin = "anonymous"; // se usar arquivos em CDN/externo

    //     // Opcional: controle de volume inicial
    //     audioElement.volume = 0.5;

    //     // Garantir que o usuário inicie o áudio (bloqueio de autoplay)
    //     document.body.addEventListener("click", () => {
    //         audioElement.play().catch((e) => {
    //             console.error("Erro ao tocar música:", e);
    //         });
    //     }, { once: true }); // apenas na primeira interação


    //     interface MusicAnalyzer {
    //         getVolume(): number; // valor normalizado 0.0 - 1.0
    //         getFFT(): Float32Array; // array de magnitudes normalizadas
    //     }

    //    class AdvancedMusicAnalyzer {
    //     private audioContext: AudioContext;
    //     private analyser: AnalyserNode;
    //     private dataArray: Float32Array;
    //     private volume: number = 0;
    //     private fftSize: number;

    //     constructor(audioElement: HTMLAudioElement, fftSize: number = 512) {
    //         this.audioContext = new AudioContext();
    //         const source = this.audioContext.createMediaElementSource(audioElement);

    //         this.analyser = this.audioContext.createAnalyser();
    //         this.analyser.fftSize = fftSize; // maior fftSize para melhor resolução
    //         this.fftSize = fftSize;

    //         source.connect(this.analyser);
    //         this.analyser.connect(this.audioContext.destination);

    //         this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

    //         this.updateVolumeLoop();
    //     }

    //     private updateVolumeLoop() {
    //         const update = () => {
    //             this.analyser.getFloatFrequencyData(this.dataArray);

    //             // Calcular volume RMS
    //             let sum = 0;
    //             for (let i = 0; i < this.dataArray.length; i++) {
    //                 const val = Math.pow(10, this.dataArray[i] / 10);
    //                 sum += val * val;
    //             }
    //             const rms = Math.sqrt(sum / this.dataArray.length);
    //             this.volume = Math.min(rms * 10, 1);

    //             requestAnimationFrame(update);
    //         };
    //         update();
    //     }

    //     getVolume(): number {
    //         return this.volume;
    //     }

    //     getFFT(): Float32Array {
    //         const normFFT = new Float32Array(this.dataArray.length);
    //         for (let i = 0; i < this.dataArray.length; i++) {
    //             const norm = (this.dataArray[i] + 100) / 100;
    //             normFFT[i] = Math.min(Math.max(norm, 0), 1);
    //         }
    //         return normFFT;
    //     }

    //     // Extrai bandas específicas e voz (freq aproximada para voz ~ 300-3kHz)
    //     getBands() {
    //         const fft = this.getFFT();
    //         const len = fft.length;

    //         const bassEnd = Math.floor(len * 0.1); // 0-10% bins graves
    //         const midStart = bassEnd;
    //         const midEnd = Math.floor(len * 0.4); // 10-40% bins médios
    //         const trebleStart = midEnd;

    //         // Voz ~ 15-35% bins (aprox 300Hz-3kHz)
    //         const voiceStart = Math.floor(len * 0.15);
    //         const voiceEnd = Math.floor(len * 0.35);

    //         const bass = fft.slice(0, bassEnd).reduce((a, b) => a + b, 0) / bassEnd;
    //         const mid = fft.slice(midStart, midEnd).reduce((a, b) => a + b, 0) / (midEnd - midStart);
    //         const treble = fft.slice(trebleStart).reduce((a, b) => a + b, 0) / (len - trebleStart);
    //         const voice = fft.slice(voiceStart, voiceEnd).reduce((a, b) => a + b, 0) / (voiceEnd - voiceStart);

    //         // Centroid, Energy e Pitch podem ser calculados de modo simplificado:
    //         const centroid = this.calculateSpectralCentroid(fft);
    //         const energy = this.calculateEnergy(fft);
    //         const pitch = this.estimatePitch(fft);

    //         // Simular batida (beat) simples: volume acima de threshold
    //         const isBeat = this.volume > 0.6 ? 1.0 : 0.0;

    //         return { bass, mid, treble, voice, centroid, energy, pitch, isBeat };
    //     }

    //     private calculateSpectralCentroid(fft: Float32Array): number {
    //         let numerator = 0;
    //         let denominator = 0;
    //         for (let i = 0; i < fft.length; i++) {
    //             numerator += i * fft[i];
    //             denominator += fft[i];
    //         }
    //         return denominator > 0 ? numerator / denominator / fft.length : 0;
    //     }

    //     private calculateEnergy(fft: Float32Array): number {
    //         let sum = 0;
    //         for (let i = 0; i < fft.length; i++) {
    //             sum += fft[i] * fft[i];
    //         }
    //         return Math.min(Math.sqrt(sum / fft.length), 1);
    //     }

    //     private estimatePitch(fft: Float32Array): number {
    //         let maxVal = 0;
    //         let maxIndex = 0;
    //         for (let i = 0; i < fft.length; i++) {
    //             if (fft[i] > maxVal) {
    //                 maxVal = fft[i];
    //                 maxIndex = i;
    //             }
    //         }
    //         return maxIndex / fft.length; // normalizado 0-1
    //     }
    // }




    //     const music_shader = createShaderProgram(
    //         gl,
    //         "music_shader",
    //         music_shader_vert.value,
    //         music_shader_frag.value
    //     );

    //     const music_material: Material = {
    //         name: "music_material",
    //         shaderName: "music_shader",
    //         color: { r: 1, g: 1, b: 1, a: 1 }
    //     };

    //     generic_manager_add(SHADER_MANAGER, music_shader.name, music_shader);
    //     generic_manager_add(MATERIAL_MANAGER, music_material.name, music_material);

    //    function music_shader_system(material: Material, musicAnalyzer: AdvancedMusicAnalyzer): ShaderSystem {
    //     const shader = generic_manager_get(shaderManager, material.shaderName)!;

    //     return {
    //         global(gl, camera, componentState) {
    //             const cameraTransform = ECS.Component.getComponent<TransformComponent>(componentState, camera, ComponentType.TRANSFORM)!;
    //             const cameraComponent = ECS.Component.getComponent<CameraComponent>(componentState, camera, ComponentType.CAMERA)!;

    //             const viewMatrix = generic_manager_get(matrixManager, cameraTransform.instanceId)!;
    //             setTranslation(viewMatrix, cameraTransform.position);
    //             shader_set_uniform_mat4(gl, shader, "uView", viewMatrix.value);

    //             const projectionMatrix = generic_manager_get(matrixManager, cameraComponent.instanceId)!;
    //             shader_set_uniform_mat4(gl, shader, "uProjection", projectionMatrix.value);

    //             // Dados do áudio
    //             const volume = musicAnalyzer.getVolume();
    //             const bands = musicAnalyzer.getBands();

    //             shader_set_uniform_1f(gl, shader, "uMusicVolume", volume);
    //             shader_set_uniform_1f(gl, shader, "uTime", performance.now() / 1000);
    //             shader_set_uniform_3f(gl, shader, "uMusicFFT", bands.bass, bands.mid, bands.treble);
    //             shader_set_uniform_1f(gl, shader, "uMusicVoice", bands.voice);
    //             shader_set_uniform_1f(gl, shader, "uMusicCentroid", bands.centroid);
    //             shader_set_uniform_1f(gl, shader, "uMusicEnergy", bands.energy);
    //             shader_set_uniform_1f(gl, shader, "uMusicPitch", bands.pitch);
    //             shader_set_uniform_1f(gl, shader, "uMusicIsBeat", bands.isBeat);
    //         },
    //         local(gl, spriteRender, transform) {
    //             const modelMatrix = generic_manager_get(matrixManager, transform.instanceId)!;
    //             setTranslation(modelMatrix, transform.position);
    //             shader_set_uniform_mat4(gl, shader, "uModel", modelMatrix.value);

    //             shader_set_uniform_4f(
    //                 gl,
    //                 shader,
    //                 "uColor",
    //                 spriteRender.color.r,
    //                 spriteRender.color.g,
    //                 spriteRender.color.b,
    //                 spriteRender.color.a,
    //             );
    //         },
    //     };
    // }


    //     const musicAnalyzer = new AdvancedMusicAnalyzer(audioElement);
    //     const music_system = music_shader_system(music_material, musicAnalyzer);
    //     generic_manager_add(SHADER_SYSTEM_MANAGER, music_material.name, music_system);

    //------------------------------------------------------------------------------------


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
    generic_manager_add(SHADER_MANAGER, shaderTexture.name, shaderTexture);

    const advanced_material: TexturedMaterial = {
        name: "advanced_material",
        shaderName: "advanced_shader",
        textureName: "",
        offset: { x: 0, y: 0 },
        scale: { x: 0.2, y: 0.2 },
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
    generic_manager_add(SHADER_MANAGER, shaderWater.name, shaderWater);

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

    // createTest(componentState, "a")
    const camera = createCamera(componentState);
    const slime = createSlime(componentState, "slime");
    // const music = createMusic(componentState, "music");

    ECS.System.addSystem(SYSTEM_STATE, SpriteRenderSystem(gl, componentState, camera));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControlerSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControllerAnimationSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, AnimatorSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, TerrainSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CameraSystem(componentState, camera, player));
    ECS.System.addSystem(SYSTEM_STATE, DepthSortingSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, ColliderSystem(componentState, SYSTEM_STATE));
    ECS.System.addSystem(SYSTEM_STATE, PhysicsSystem(componentState));

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