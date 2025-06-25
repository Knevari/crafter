import { engine2d } from "./core/Engine2d";
import { createCamera } from "./core/entities/camera-entity";
import { KeyInputSystem } from "./core/input/keyInputSystem";
import { type Texture, resourceManager } from "./core/managers/resources-manager";
import { ColliderSystem } from "./core/systems/collider.system";
import CharacterControllerAnimationSystem from "./core/systems/character-controller-animations";
import CharacterControlerSystem from "./core/systems/character-controller-system";
import { TerrainSystem } from "./core/systems/terrain-system";
import Time from "./core/time/time";
import { createPlayer } from "./game/entities/player.entity";

import { ECS, Systems } from "./engine/TwoD";

const textures: Texture[] = [
  { name: "player", path: "./assets/textures/Player.png" },
  { name: "slime", path: "./assets/textures/Slime.png" },
  { name: "oak_tree", path: "assets/textures/OakTree.png" }
];

await resourceManager.loadTextures(textures);

const systemState = ECS.System.createState();
const componentState = ECS.Component.createState();

const player = createPlayer(componentState, "player");

createCamera(componentState);


ECS.System.addSystem(systemState, Systems.Render.AnimatorSystem(componentState));
ECS.System.addSystem(systemState, Systems.Render.DepthSortingSystem(componentState));
ECS.System.addSystem(systemState, Systems.Render.CameraSystem(engine2d.getContext(), componentState, player));
ECS.System.addSystem(systemState, Systems.Render.SpriteRenderSystem(componentState));

ECS.System.addSystem(systemState, ColliderSystem(componentState, systemState));
ECS.System.addSystem(systemState, TerrainSystem(componentState));
ECS.System.addSystem(systemState, CharacterControlerSystem(componentState));
ECS.System.addSystem(systemState, CharacterControllerAnimationSystem(componentState));
ECS.System.addSystem(systemState, KeyInputSystem());

const time = new Time();

time.on("start", () => {
  ECS.System.callStart(systemState);
});

time.on("fixedUpdate", () => {
  ECS.System.callFixedUpdate(systemState);
});

time.on("lateUpdate", () => {
  ECS.System.callLateUpdate(systemState);
});

time.on("render", () => {
  ECS.System.callRender(systemState);
  ECS.System.callDrawGizmos(systemState);

});

time.on("update", () => {
  ECS.System.callUpdate(systemState);
});

time.start();


