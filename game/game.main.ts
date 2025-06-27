import { ColliderSystem } from "../core/gears/collider/collider.system.ts";
import { SYSTEM_STATE } from "../core/gears/ecs/system";
import { type Texture, resourceManager } from "../core/managers/resources-manager";
import { ECS, Components, Render } from "../engine/TwoD";
import { createCamera } from "./entities/camera.entity";
import { createPlayer } from "./entities/player.entity";
import { InputSystem } from "./input/input.system";
import CharacterControllerAnimationSystem from "./systems/character-controller/character-controller-animations";
import CharacterControlerSystem from "./systems/character-controller/character-controller-system";
import { TerrainSystem } from "./systems/procedural-world/terrain-system.ts";

async function LoadResources() {

    const textures: Texture[] = [
        { name: "player", path: "./assets/textures/Player.png" },
        { name: "slime", path: "./assets/textures/Slime.png" },
        { name: "oak_tree", path: "assets/textures/OakTree.png" },
        { name: "bushe", path: "assets/textures/Bushes.png" }
    ];

    await resourceManager.loadTextures(textures);
}

export async function GameMain() {

    await LoadResources()
    const componentState = ECS.Component.createState();

    const player = createPlayer(componentState, "player");
    const camera = createCamera(componentState);

    ECS.System.addSystem(SYSTEM_STATE, Components.Animator.AnimatorSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, Render.DepthSorting.DepthSortingSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, Components.Camera.CameraSystem(componentState, camera, player));
    ECS.System.addSystem(SYSTEM_STATE, Components.SpriteRender.SpriteRenderSystem(componentState, camera));

    ECS.System.addSystem(SYSTEM_STATE, ColliderSystem(componentState, SYSTEM_STATE));
    ECS.System.addSystem(SYSTEM_STATE, TerrainSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControlerSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, CharacterControllerAnimationSystem(componentState));
    ECS.System.addSystem(SYSTEM_STATE, InputSystem());


}